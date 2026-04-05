package main

import "time"

// StatusResponse is returned by getStatus and served by /api/status.
type StatusResponse struct {
	Active       bool  `json:"active"`
	SecondsUntil int64 `json:"secondsUntil"`
}

// getStatus returns whether it's currently Whisky Wednesday (Wednesday >= 17:00 Eastern)
// and the seconds until the next one if not.
func getStatus(now time.Time) StatusResponse {
	eastern, _ := time.LoadLocation("America/New_York")
	nowE := now.In(eastern)

	if nowE.Weekday() == time.Wednesday && nowE.Hour() >= 17 {
		return StatusResponse{Active: true, SecondsUntil: 0}
	}

	target := nextWednesdayAt5PM(nowE, eastern)
	secs := target.Unix() - now.Unix()
	if secs < 0 {
		secs = 0
	}
	return StatusResponse{Active: false, SecondsUntil: secs}
}

// nextWednesdayAt5PM returns the next Wednesday at 17:00:00 Eastern time.
// Using time.Date with the IANA location means Go's timezone database resolves
// EST/EDT automatically — no manual UTC offset arithmetic needed.
func nextWednesdayAt5PM(nowE time.Time, eastern *time.Location) time.Time {
	daysUntilWed := (int(time.Wednesday) - int(nowE.Weekday()) + 7) % 7
	candidate := time.Date(
		nowE.Year(), nowE.Month(), nowE.Day()+daysUntilWed,
		17, 0, 0, 0,
		eastern,
	)
	if !nowE.Before(candidate) {
		candidate = candidate.AddDate(0, 0, 7)
	}
	return candidate
}
