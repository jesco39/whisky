package main

import (
	"encoding/json"
	"html/template"
	"io/fs"
	"net/http"
	"time"
)

func handleIndex(tmplFS fs.FS) http.HandlerFunc {
	tmpl := template.Must(template.ParseFS(tmplFS, "templates/index.html"))
	return func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		tmpl.Execute(w, getStatus(time.Now()))
	}
}

func handleStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	json.NewEncoder(w).Encode(getStatus(time.Now()))
}
