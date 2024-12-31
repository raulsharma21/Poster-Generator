# Using flask to make an api 
# import necessary libraries and functions 
from flask import Flask, jsonify, request, send_file
from search import getSearchResultAsJson, getAlbumInfo
from poster import generatePoster
import json
from io import BytesIO
from flask_cors import CORS
from PIL import Image, ImageDraw, ImageFont
import base64

  
# creating a Flask app 
app = Flask(__name__) 
# CORS(app)
  
# on the terminal type: curl http://127.0.0.1:5000/ 
# returns hello world when we use GET. 
# returns the data that we send when we use POST. 
@app.route('/', methods = ['GET', 'POST']) 
def home(): 
    if(request.method == 'GET'): 
        data = "hello world"
        return jsonify({'data': data}) 

@app.route('/search', methods = ['GET'])
def search():
    request_type = request.args.get('type')
    
    # return jsonify({'query': query, 'quantity': quantity})
    if(not request_type):
        return jsonify({'error': 'No type specified.'})

    if request_type == 'search':
        query = request.args.get('query')
        quantity = request.args.get('quantity')
        json_result = getSearchResultAsJson(query, quantity)
        return json_result

    elif request_type == 'get-info':
        id = request.args.get('id')
        print(id)
        json_result = getAlbumInfo(id)
        return json_result

    else:
        print(json.dumps({"error": "Valid type, invalid args."}))


@app.route('/poster', methods=['POST'])
def generate():
    try:
        # Get parameters from request
        data = request.json
        album_name = data.get('album_name')
        artist_name = data.get('artist_name')
        tracklist = data.get('tracklist')
        copyright_text = data.get('copyright_text')
        scannable = Image.open(BytesIO(base64.b64decode(data.get('scannable'))))
        image = Image.open(BytesIO(base64.b64decode(data.get('image'))))
        bg_color = 'DED8CE'

        # Generate the poster
        poster_bytes = generatePoster(bg_color, image, album_name, artist_name, tracklist, scannable, copyright_text)

        # Create BytesIO object from the poster bytes
        img_io = BytesIO(poster_bytes)
        img_io.seek(0)
        
        # Return the image using send_file
        return send_file(
            img_io,
            mimetype='image/jpeg',  # Adjust mimetype based on your image format
            as_attachment=False
        )
    
    except Exception as e:
        return str(e), 400
  

  
# driver function 
if __name__ == '__main__': 
    app.run() 