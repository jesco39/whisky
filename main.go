package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	_ "time/tzdata"
)

//go:embed templates/*
var templateFS embed.FS

//go:embed static/*
var staticFS embed.FS

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /", handleIndex(templateFS))
	mux.HandleFunc("GET /api/status", handleStatus)

	staticSub, _ := fs.Sub(staticFS, "static")
	mux.Handle("GET /static/", http.StripPrefix("/static/", http.FileServerFS(staticSub)))

	addr := ":8080"
	fmt.Printf("Whisky Wednesday server running at http://localhost%s\n", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
