package main

import "testing"

func TestDummy(t *testing.T) {
	if getenv("X", "default") != "default" {
		t.Fatalf("expected default")
	}
}
