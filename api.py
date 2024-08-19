import base64
from io import BytesIO
import json
from requests import post, get
import requests
from dotenv import load_dotenv
import os
from PIL import Image
from generate_poster import generatePoster

load_dotenv()

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
        json_result = result.json()
        token = json_result['access_token']
        return token
    else:
        # Print the entire result for debugging
        print(f"Error: {result.status_code}")
        print(f"result: {result.text}")
        result.raise_for_status()
    
def getAuthHeader(token):
    return {"Authorization": "Bearer " + token}

def search(token, type, input, limit):
    url = 'https://api.spotify.com/v1/search'
    headers = getAuthHeader(token)
    query = f"?q={input}&type={type}&limit={limit}"

    query_url = url+query

    result = get(query_url, headers=headers)
    if result.status_code == 200:
        json_result = result.json()[type+'s']['items']
        if len(json_result) == 0:
            print(f"No search found for type '{type}' and prompt '{input}'")
            return None
        
        return json_result
    else:
        # Print the entire result for debugging
        print(f"Error: {result.status_code}")
        print(f"result: {result.text}")
        result.raise_for_status()

def getImages(search_result):
    images = []
    for result in search_result:
        image_url = result['images'][0]['url']

        response = requests.get(image_url)

        if response.status_code == 200:
            image_data = BytesIO(response.content)

            im = Image.open(image_data)
            images.append(im)
        else:
            print(f"Failed to retrieve image: {response.status_code}")

    return images

def getAlbumNames(search_result):
    albums = []
    for result in search_result:
        album_name = result['name']

        albums.append(album_name)
    return albums

def getArtistNames(search_result):
    artists = []
    for result in search_result:
        artists.append(result['artists'][0]['name'])
    return artists

def getTracklist(token, search_result):
    tracklists = []
    
    for result in search_result:
        id = result['id']
        url = f"https://api.spotify.com/v1/albums/{id}"
        headers = getAuthHeader(token)
        response = get(url, headers=headers)

        songlist = []
        if response.status_code == 200:
            album = response.json()['tracks']['items']
            
            for song in album:
                songlist.append(song['name'])
                
        else:
            # Print the entire result for debugging
            print(f"Error: {response.status_code}")
            print(f"result: {response.text}")
        
        tracklists.append(songlist)

    return tracklists





token = getToken()
search_result = search(token, 'album', "Kings of Leon", limit=3)
images = getImages(search_result)
albums = getAlbumNames(search_result)
artists = getArtistNames(search_result)
tracklists = getTracklist(token, search_result)

for i in range(len(images)):
    
    generatePoster(images[i], albums[i], artists[i], tracklists[i])
