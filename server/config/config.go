package config

import (
	"fmt"
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
	}
	Debug bool

	ApiSecret         string `mapstructure:"API_SECRET"`
	ServerAddress     string `mapstructure:"ServerAddress"`
	TokenHourLifespan string `mapstructure:"TOKEN_HOUR_LIFESPAN"`
	// Add other configuration fields as needed
}

func (c *Config) DSN() string {
	port := strconv.Itoa(c.Database.Port)

	return "host=" + c.Database.Host +
		" port=" + port +
		" user=" + c.Database.User +
		" password=" + c.Database.Password +
		" dbname=" + c.Database.DB +
		" sslmode=disable"
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

	// print the loaded config for debugging
	fmt.Printf("Loaded config: %+v\n", config)
	return
}
