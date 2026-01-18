# Define ANSI color codes as variables
COL_RED=\033[0;31m
COL_GREEN=\033[0;32m
COL_WHITE=\033[0;37m

sqlc:
	@echo "${COL_WHITE}Generating SQLC code...${COL_WHITE}"
	cd server && sqlc generate

run: 
	@echo "${COL_GREEN}Running the Go application...${COL_GREEN}"
	@cd server && go run ./main.go

clean_shit:
	@echo "Removing all branches Except `master`"
	@git checkout master && git branch | grep -v "master" | xargs git branch -D 
	@echo "$(COL_GREEN)Pull `master`$(COL_GREEN)"
	@git pull
