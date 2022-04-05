package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

const db = "forlogin"
const col = "details"

var jwtKey = []byte("secret_key")

var cookie http.Cookie
var client *mongo.Client

type Credentials struct {
	ID       primitive.ObjectID `json:"_id"`
	Username string             `json:"username"`
	
	FirstName string `json:"firstname" bson:"firstname"`
	LastName  string `json:"lastname" bson:"lastname"`
	Password string             `json:"password" bson:"password"`
	Email string `json:"email" bson:"email"`
	//ConfirmPassword string             `json:"confirmpassword" bson:"confirmpassword"`
	//Password  string `json:"password" bson:"password"`
}

type Claims struct {
	Password string             `json:"password" bson:"password"`

	Email string `json:"email" bson:"email"`

	jwt.StandardClaims
}

func getHash(pwd []byte) string {
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		log.Println(err)
	}
	return string(hash)
}

func AuthRequired(handler http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//var  *jwt.Claims

		tokenString := r.Header.Get("Authorization")
		// t := token[6:]


		key := strings.Replace(tokenString, "Bearer ", "", -1)
		fmt.Println(key)


		cookie, _ := r.Cookie("token")
		tokenStr := cookie.Value
		fmt.Println(tokenStr)

		if key == tokenStr {
			token, err := jwt.Parse(key, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("there was an error in parsing")
				}
				return jwtKey, nil
			})
			if err != nil {
				fmt.Println(err)
			}
			if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
				fmt.Println(claims)
			}

			handler.ServeHTTP(w, r)
		}
	})
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("X-ID", "1234")
		log.Println(r.RequestURI)

		next.ServeHTTP(w, r)
	})
}


func GetAllDetails(response http.ResponseWriter, request *http.Request) {
	c := make(map[string]interface{})
	response.Header().Set("content-type", "application/json")
	//var params = mux.Vars(request)
	//_id, _ := primitive.ObjectIDFromHex(params["id"])
	//filter := bson.M{}
	collection := client.Database(db).Collection(col)
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)

	p, err := collection.Find(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)

	}
	var alldetails []bson.M
	if err = p.All(ctx, &alldetails); err != nil {
		log.Fatal(err)
	}
	
	c["success"] = true
	c["data"] = alldetails
	json.NewEncoder(response).Encode(c)

}

func userSignup(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("Content-Type", "application/json")
	var user Credentials
	json.NewDecoder(request.Body).Decode(&user)
	user.Password = getHash([]byte(user.Password))
	
	collection := client.Database(db).Collection(col)
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	result, _ := collection.InsertOne(ctx, user)
	json.NewEncoder(response).Encode(result)

}

func Login(w http.ResponseWriter, r *http.Request) {
	var credentials Credentials
	var dbcredentials Credentials
	err := json.NewDecoder(r.Body).Decode(&credentials)
	collection := client.Database(db).Collection(col)
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = collection.FindOne(ctx, bson.M{"email": credentials.Email}).Decode(&dbcredentials)
	fmt.Println(dbcredentials)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	userPass := []byte(credentials.Password)
	dbPass := []byte(dbcredentials.Password)

	passErr := bcrypt.CompareHashAndPassword(dbPass, userPass)

	if passErr != nil {
		log.Println(passErr)
		//w.Write([]byte(`{"response":"Wrong Password!"}`))
		w.WriteHeader(http.StatusInternalServerError)
		
		return
	}

	claims := &Claims{
		
		Email:    credentials.Email,
		//Password: credentials.Password ,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	http.SetCookie(w,
		&http.Cookie{
			Name:  "token",
			Value: tokenString,
			//Expires: expirationTime,
		})
	
		
	json.NewEncoder(w).Encode(bson.M{"email":dbcredentials.Email,
"firstname":dbcredentials.FirstName,"lastname":dbcredentials.LastName,"token":tokenString})
}				

func getdetailsByid(_id primitive.ObjectID) (map[string]interface{}, error) {
	var logindetails bson.M
	collection := client.Database(db).Collection(col)
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	if err := collection.FindOne(ctx, bson.M{"_id": _id}).Decode(&logindetails); err != nil {
		fmt.Println(err)
		return nil, err
	}
	return logindetails, nil
}
func ChangePassword(w http.ResponseWriter, r *http.Request) {
	var credentials Credentials
	var dbcredentials Credentials
	err :=json.NewDecoder(r.Body).Decode(&credentials)
	collection := client.Database(db).Collection(col)
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = collection.FindOne(ctx, bson.M{"email": credentials.Email}).Decode(&dbcredentials)
	fmt.Println(dbcredentials)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	userPass := []byte(credentials.Password)
	dbPass := []byte(dbcredentials.Password)

	passErr := bcrypt.CompareHashAndPassword(dbPass, userPass)

	if passErr != nil {
		log.Println(passErr)
		//w.Write([]byte(`{"response":"Wrong Password!"}`))
		w.WriteHeader(http.StatusInternalServerError)
		
		return
	}

	
	json.NewEncoder(w).Encode(bson.M{"sucess":true})

}

func UpdatePassword(response http.ResponseWriter, request *http.Request) {
	//c := make(map[string]interface{})
	//json.NewEncoder(response).Encode(c)
	var credentials Credentials

	_ = json.NewDecoder(request.Body).Decode(&credentials)
	credentials.Password = getHash([]byte(credentials.Password))
	filter := bson.M{"email": credentials.Email}
	
	update := bson.D{
		{"$set", bson.D{{"password",credentials.Password}}},
	}

	collection := client.Database(db).Collection(col)
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	getresult, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		fmt.Println(err)
		//c["error"] = "an error encountered"
		//json.NewEncoder(response).Encode(c)
		response.WriteHeader(http.StatusBadRequest)
		
		return
	}
	json.NewEncoder(response).Encode(getresult)
}




func Home(w http.ResponseWriter, r *http.Request) {

	cookie, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			fmt.Println("err1")
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	tokenStr := cookie.Value

	claims := &Claims{}

	tkn, err := jwt.ParseWithClaims(tokenStr, claims,
		func(t *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if !tkn.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	w.Write([]byte(fmt.Sprintf("userdetails :\n  Email of user : %s\n  jwtkey: %s\n ", claims.Email,jwtKey )))

}

func main() {
	fmt.Println("Starting the application")

	r := mux.NewRouter()
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	client, _ = mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	r.Use(loggingMiddleware)
	r.HandleFunc("/signin", userSignup).Methods("POST")
	r.HandleFunc("/login", Login).Methods("POST")
	r.HandleFunc("/getall/alldetails/details",GetAllDetails)
	r.HandleFunc("/home/get", AuthRequired(Home))
	r.HandleFunc("/api/cpassword/get", ChangePassword).Methods("POST")
	r.HandleFunc("/updatepass/upassword/getpass/update", UpdatePassword).Methods("PATCH")
	//methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "PATCH"})
	//origins := handlers.AllowedMethods([]string{"*"})
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},

		AllowCredentials: true,
		AllowedHeaders:   []string{"*"},

		// Enable Debugging for testing, consider disabling in production
		Debug: true,
	})

	handler := c.Handler(r)
	log.Fatal(http.ListenAndServe(":8080",handler))
}
