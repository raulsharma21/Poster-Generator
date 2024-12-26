# search_script.py

import base64
import json
import os
import sys
from dotenv import load_dotenv
from requests import post, get

load_dotenv()

def debug(message):
    print(f"DEBUG: {message}", file=sys.stderr)


def getToken():
    auth_string = os.getenv('CLIENT_ID') + ":" + os.getenv('CLIENT_SECRET')
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {"grant_type": "client_credentials"}
    result = post(url, headers=headers, data=data)

    if result.status_code == 200:
        return result.json()['access_token']
    else:
        print(f"Error: {result.status_code}, result: {result.text}")
        result.raise_for_status()

def getAuthHeader(token):
    return {"Authorization": "Bearer " + token}

def search(token, type, input, limit):
    url = 'https://api.spotify.com/v1/search'
    headers = getAuthHeader(token)
    query = f"?q={input}&type={type}&limit={limit}"
    result = get(url + query, headers=headers)
    
    if result.status_code == 200:
        json_result = result.json()[type+'s']['items']
        return json_result if json_result else None
    else:
        print(f"Error: {result.status_code}, result: {result.text}")
        result.raise_for_status()

def getAlbumNames(search_result):
    return [result['name'] for result in search_result]

def getArtistNames(search_result):
    return [result['artists'][0]['name'] for result in search_result]

def getImages(search_result):
    return [result['images'][0]['url'] for result in search_result if result['images']]

def getSearchResultAsJson(query, limit=8):
    token = getToken()
    search_result = search(token, 'album', query, limit)
    
    if search_result:
        albums_data = []
        
        for album in search_result:
            album_data = {
                "id": album['id'],
                "album_name": album['name'],
                "artist_name": album['artists'][0]['name'] if album['artists'] else "Unknown Artist",
                "cover_url": album['images'][0]['url'] if album['images'] else None

            }
            albums_data.append(album_data)
        
        return json.dumps({"albums": albums_data})
    
    # Return structured error if no results
    return json.dumps({"error": {"message": "No results found.", "query": query}})


def getAlbumInfo(id):
    album_name = ''
    artist_name = ''
    cover_url = ''
    tracklist = []
    copyright = ''

    token = getToken()
        
    url = f"https://api.spotify.com/v1/albums/{id}"
    headers = getAuthHeader(token)
    response = get(url, headers=headers)

    if response.status_code == 200:
        album_name = response.json()['name']

        artist_name = response.json()['artists'][0]['name']

        cover_url = response.json()['images'][0]['url']

        # extract the list of songs
        album = response.json()['tracks']['items']
        for song in album:
            tracklist.append(song['name'])

        # extract the copyright text
        copyrights = response.json()['copyrights']
        copyright = copyrights[0]['text']


    else:
        return json.dumps({"error": {"message": "No results found.", "query": query}})

    album_info = {"album-name":album_name, "artist-name": artist_name, "cover-url": cover_url, "tracklist": tracklist, "copyright": copyright}

    print(json.dumps(album_info))


def main(query, quantity):
    json_result = getSearchResultAsJson(query, quantity)
    print(json_result)  # Print the result to stdout for the route to capture

    

if __name__ == "__main__":
    if sys.argv[1] == 'search':
        query = sys.argv[2]
        quantity = sys.argv[3]
        main(query, quantity)

    elif sys.argv[1] == 'get-info':
        id = sys.argv[2]
        getAlbumInfo(id)

    else:
        print(json.dumps({"error": "No query provided."}))
