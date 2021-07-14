-- Declaring the state variables
set theStateM to ""
set theStateS to ""
set theStateQ to ""

-- Checking the Apple Music app
tell application "Music"
	if it is running then
		set theStateM to player state as text
		
		if theStateM is "playing" then
			return "APPLE_MUSIC"
		else if theStateM is not "playing" then
			log "STOPED_APPLEMUSIC"
		end if
	end if
end tell

-- Checking the spotify
tell application "Spotify"
	if it is running then
		set c to the current track
		set theStateS to player state as text
		
		if theStateS is "playing" then
			return "SPOTIFY"
		else if theStateS is not "playing" then
			log "STOPED_SPOTIFY"
		end if
	end if
end tell

-- Checking Quick time player
tell application "QuickTime Player"
	try
		if it is running then
			set theStateQ to get playing of document 1 
			if theStateQ is true then
				return "QUICKTIMEPLAYER"
			else
				log "STOPED_QUICKTIMEPLAYER"
			end if 
		end if
	on error 
		-- -- -- -- --
	end try
end tell

