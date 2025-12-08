package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

// ShellExec executes a shell command and returns error.
func ShellExec(command string) error {
	cmd := exec.Command("bash", "-c", command)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		return err
	}
	return nil
}

func main() {
	imageName := "quotes-app-server"

	// This is a placeholder for the main function.
	// The actual implementation will depend on the specific requirements of the build process.
	// For example, it could involve compiling code, packaging files, or generating documentation.

	suffix := "build/Dockerfile"
	// Get the absolute path to the Dockerfile.
	absPath, _ := filepath.Abs("")
	if absPath == "" {
		fmt.Println("Error: Unable to get the absolute path.")
		return
	}

	absPathDockerFile := filepath.Join(absPath, suffix)
	if _, err := os.Stat(absPathDockerFile); os.IsNotExist(err) {
		fmt.Printf("Dockerfile does not exist at path: %s\n", absPathDockerFile)
		return
	}

	tasksCmds := map[string]string{
		"docker-build": fmt.Sprintf("docker build -t %v -f %v %v  ", imageName, absPathDockerFile, absPath),
		"docker-tag":   fmt.Sprintf("docker tag %v:latest %v:latest", imageName, imageName),
		"docker-list":  fmt.Sprintf("docker images | grep %v", imageName),
		"dcoker-run":   fmt.Sprintf("docker run -p 8080:8080 -e DB_HOST=docker.for.mac.host.internal %v:latest", imageName),
	}

	// Execute each task in the build process.
	for taskName, task := range tasksCmds {
		err := ShellExec(task)
		if err != nil {
			fmt.Printf("Error executing task '%s': %v\n", taskName, err)
			return
		}

		fmt.Printf("\nExecuted task: %s ✅\n", taskName)
	}
}
