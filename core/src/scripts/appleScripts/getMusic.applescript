-- Player states
set theStateM to ""
set theStateS to ""
set theStateQ to ""

-- Getting from music
tell application "Music"
	-- Hot fix! Added error handling (err-34-disk-no-class) 
	try 
		if it is running then
			set appleMusicCurrentTrack to current track

			--  Setting the variable to player state as text
			set theStateM to player state as text

			-- Checking if the Apple Music is playing
			if theStateM is "playing" then
				-- Returing the converted value
				return { (name of appleMusicCurrentTrack as text), (artist of appleMusicCurrentTrack as text) }
			else if theStateM is not "playing" then
				-- Or if is not playing just logging the Apple music is not playing
				log "STOPED_APPLEMUSIC"
			end if
		end if
	on error 
	-- -- -- -- --
	end try
end tell

-- Getting from spotify (the same shema as in the apple music)
tell application "Spotify"
	try 
		if it is running then
			set spotifyCurrentTrack to the current track
		
			set theStateS to player state as text
		
			if theStateS is "playing" then
				return { (name of spotifyCurrentTrack as text), (artist of spotifyCurrentTrack as text) }
			else if theStateS is not "playing" then
				log "STOPED_SPOTIFY"
			end if
		end if
	on error 
	-- -- -- -- --
	end try
end tell

-- Getting from quick time player
-- Warning! This only getting path of the first opened document!
tell application "QuickTime Player"
	try
		if it is running then
			set deafultIndex to 1

			-- Getting the informations about the document
			set theStateQ to get playing of document deafultIndex
			if theStateQ is true then
				-- Returning the file path and checking
				set filePath to file of document deafultIndex as text
					return filePath
				else
					log "STOPED_QUICKTIMEPLAYER"
			end if 
		end if
	on error
		-- -- -- -- --
	end try
end tell