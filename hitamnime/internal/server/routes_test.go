package server

import (
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHandler(t *testing.T) {
	s := &Server{}
	server := httptest.NewServer(http.HandlerFunc(s.HelloWorldHandler))
	defer server.Close()
	resp, err := http.Get(server.URL)
	if err != nil {
		t.Fatalf("error making request to server. Err: %v", err)
	}
	defer resp.Body.Close()
	// Assertions
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected status OK; got %v", resp.Status)
	}
	expected := "{\"message\":\"Hello World\"}"
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("error reading response body. Err: %v", err)
	}
	if expected != string(body) {
		t.Errorf("expected response body to be %v; got %v", expected, string(body))
	}
}

func TestRegisterRoutes(t *testing.T) {
	s := &Server{}
	handler := s.RegisterRoutes()
	server := httptest.NewServer(handler)
	defer server.Close()

	// 1. Test API endpoint
	apiResp, err := http.Get(server.URL + "/api/hello")
	if err != nil {
		t.Fatalf("failed to call /api/hello: %v", err)
	}
	defer apiResp.Body.Close()
	if apiResp.StatusCode != http.StatusOK {
		t.Errorf("expected 200 OK for /api/hello; got %v", apiResp.Status)
	}

	// 2. Test Root Static File serving (index.html)
	rootResp, err := http.Get(server.URL + "/")
	if err != nil {
		t.Fatalf("failed to call root static: %v", err)
	}
	defer rootResp.Body.Close()
	if rootResp.StatusCode != http.StatusOK {
		t.Errorf("expected 200 OK for static /; got %v", rootResp.Status)
	}
}
