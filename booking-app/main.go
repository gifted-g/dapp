package main
//go get github.com/go-sql-driver/mysql
import (
	"encoding/json"
	"fmt"
	"log"
	// "github.com/gin-gonic/gin"
	"net/http"
	 "database/sql"
	//"strconv"
	"sync"
	"time"
	
)



const conferenceTickets int = 150
var conferenceName = "Go Conference"
var remainingTickets uint = 150
var bookings = make([]UserData, 0)

type UserData struct {
        FirstName      string `json:"firstName"`
        LastName       string `json:"lastName"`
        Email          string `json:"email"`
        NumberOfTickets uint   `json:"tickets"`
}

var wg = sync.WaitGroup{}

func main() {
        http.HandleFunc("/remainingTickets", getRemainingTickets)
        http.HandleFunc("/bookTicket", bookTicketHandler)

        // Serve static files from the "public" directory
        fs := http.FileServer(http.Dir("./public"))
        http.Handle("/", fs)

        fmt.Println("Server is running on http://localhost:8080")
        log.Fatal(http.ListenAndServe(":8080", nil))



		var err error
    db, err = sql.Open("mysql", "username:password@tcp(localhost:3306)/allstream")
    if err != nil {
        log.Fatal(err)
    }

    r := gin.Default()

    r.GET("/", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"message": "Welcome to AllStream!"})
    })

    r.GET("/login", func(c *gin.Context) {
        url := googleOauthConfig.AuthCodeURL("state")
        c.Redirect(http.StatusTemporaryRedirect, url)
    })

    r.GET("/callback", func(c *gin.Context) {
        code := c.Query("code")
        token, err := googleOauthConfig.Exchange(oauth2.NoContext, code)
        if err != nil {
            log.Println(err)
            return
        }
        // Use token to get user info
        c.JSON(http.StatusOK, gin.H{"token": token})
    })

    r.Run(":8080")
}

// ... rest of the code remains the same .../ ... existing code ..

 

func getRemainingTickets(w http.ResponseWriter, r *http.Request) {
	response := map[string]uint{"remainingTickets": remainingTickets}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func bookTicketHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		var userData UserData
		err := json.NewDecoder(r.Body).Decode(&userData)
		if err != nil {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		isValidName, isValidEmail, isValidTicketNumber := validateUserInput(userData.FirstName, userData.LastName, userData.Email, userData.NumberOfTickets)
		if !isValidName || !isValidEmail || !isValidTicketNumber {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		bookTicket(userData)

		response := map[string]interface{}{
			"success":         true,
			"remainingTickets": remainingTickets,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)

		wg.Add(1)
		go sendTicket(userData)
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}

func bookTicket(userData UserData) {
	remainingTickets -= userData.NumberOfTickets
	bookings = append(bookings, userData)
	fmt.Printf("Thank you %v %v for booking %v tickets.\n", userData.FirstName, userData.LastName, userData.NumberOfTickets)
}

func sendTicket(userData UserData) {
	time.Sleep(10 * time.Second)
	fmt.Printf("Sending %v tickets to %v\n", userData.NumberOfTickets, userData.Email)
	wg.Done()
}

func validateUserInput(firstName, lastName, email string, userTickets uint) (bool, bool, bool) {
	isValidName := len(firstName) > 1 && len(lastName) > 1
	isValidEmail := len(email) > 5 && emailContainsAt(email)
	isValidTicketNumber := userTickets > 0 && userTickets <= remainingTickets
	return isValidName, isValidEmail, isValidTicketNumber
}



func emailContainsAt(email string) bool {
	return len(email) >= 3 && email[1] == '@'
}



