package mailer

import (
	"fmt"
	"log"
	"math/rand"
	"net/smtp"
	"os"
	"path/filepath"
	"text/template"

	"quotes-app/config"
	db "quotes-app/db/sqlc"
)

type htmlQuote struct {
	Content string
	Author  string
	Class   string
}

type htmlData struct {
	InputData []*htmlQuote
	Output    string
}

func (h *htmlData) Write(data []byte) (int, error) {
	// save the data
	h.Output += string(data)
	return len(data), nil
}

// Generate radom N numbers between min and max
func generateRandomNumbers(min, max, n int) []int {
	nums := make(map[int]bool)
	var result []int
	for len(result) < n {
		num := rand.Intn(max-min+1) + min
		if !nums[num] {
			nums[num] = true
			result = append(result, num)
		}
	}

	return result
}

// SendMail sends an email using the provided configuration.
func SendMail(body string, config *config.Config) error {
	// Validate the configuration
	if config == nil {
		return fmt.Errorf("configuration cannot be nil")
	}

	// append Headers for HTML email
	headers := fmt.Sprintf("From: %s\nTo: %s\nSubject: %s\nMIME-Version: 1.0\nContent-Type: text/html; charset=\"UTF-8\"\n\n",
		config.GmailSenderEmail,
		config.GmailReceiverEmail,
		config.GmailSubject)

	// Create the email message
	message := []byte(headers + "\n" + body)

	// SMTP server address
	smtpAddress := fmt.Sprintf("%s:%d", config.GmailSmtpHost, config.GmailSmtpPort)

	auth := smtp.PlainAuth("", config.GmailSenderEmail, config.GmailPassword, config.GmailSmtpHost)

	err := smtp.SendMail(smtpAddress, auth, config.GmailSenderEmail, []string{config.GmailReceiverEmail}, message)
	if err != nil {
		log.Fatalf("Failed to send email: %v", err)
	}

	return nil
}

func GeneratedHtmlEmailBody(quotesList []*db.Quote) string {
	pwd, err := os.Getwd()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	// declare all the html files
	htmlFiles := []string{
		filepath.Join(pwd, "/mail/html/partials/quote.html"),
		filepath.Join(pwd, "/mail/html/pages/home.html"),
	}

	ts, err := template.ParseFiles(htmlFiles...)
	if err != nil {
		log.Fatal(err)
	}

	htmlQhotesList := make([]*htmlQuote, 5)

	// assign a class to each quote
	for index, randNum := range generateRandomNumbers(1, 6, 5) {
		htmlQhotesList[index] = &htmlQuote{
			Content: quotesList[index].Content,
			Author:  quotesList[index].Author,
			Class:   fmt.Sprintf("quote_%v", randNum),
		}
	}

	// Quote data
	htmlData := &htmlData{InputData: htmlQhotesList, Output: ""}

	err = ts.ExecuteTemplate(htmlData, "home", htmlQhotesList)
	if err != nil {
		log.Fatal(err)
	}

	return htmlData.Output
}
