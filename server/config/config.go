package config

import (
	"log"
	"os"
	"strconv"

	"github.com/spf13/viper"
)

// Config holds the application configuration settings.
type Config struct {
	Port     int
	Database struct {
		Host     string
		Port     int
		Password string
		DB       string
		User     string
		SSLMode  string
	}
	Debug bool

	ApiSecret         string `mapstructure:"API_SECRET"`
	ServerAddress     string `mapstructure:"ServerAddress"`
	TokenHourLifespan string `mapstructure:"TOKEN_HOUR_LIFESPAN"`
	// Add other configuration fields as needed

	GmailPassword      string `mapstructure:"gmail_password"`
	GmailSmtpHost      string `mapstructure:"gmail_smtp_host"`
	GmailSmtpPort      int    `mapstructure:"gmail_smtp_port"`
	GmailSenderEmail   string `mapstructure:"gmail_sender_email"`
	GmailReceiverEmail string `mapstructure:"gmail_receiver_email"`
	GmailSubject       string `mapstructure:"gmail_subject"`
}

func (c *Config) DSN() string {
	port := strconv.Itoa(c.Database.Port)

	return "host=" + c.Database.Host +
		" port=" + port +
		" user=" + c.Database.User +
		" password=" + c.Database.Password +
		" dbname=" + c.Database.DB +
		" sslmode=" + c.Database.SSLMode
}

// LoadConfig creates a new Config instance with default values.
func LoadConfig(name, path string) (config Config) {
	viper.AddConfigPath(path)
	viper.SetConfigName(name)
	viper.SetConfigType("yaml")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("config: %v", err)
		return
	}
	if err := viper.Unmarshal(&config); err != nil {
		log.Fatalf("config: %v", err)
		return
	}

	// Get DB host from environment variable if set
	dbHost := os.Getenv("DB_HOST")
	if dbHost != "" {
		config.Database.Host = dbHost
	}

	return
}
