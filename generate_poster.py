from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont


# def generatePoster(image):
#     poster = Image.new('RGB', (2480, 3508), (222, 216, 206))

#     img_resized = image.resize((2120, 2120))
#     # poster.paste(img_resized, (150, 150, 2180, 3208))

#     poster.paste(img_resized, (180, 180))

#     # poster.show()

#     # Generate a color palette with 5 colors
#     paletted = image.convert('P', palette=Image.ADAPTIVE, colors=5)
#     palette = paletted.getpalette()[:15]  # Get the first 15 values (5 colors, 3 values each)

#     # Draw the palette graphic on the poster
#     draw = ImageDraw.Draw(poster)
#     block_size = 100  # Size of each color block
#     padding = 10      # Padding between blocks
#     start_x = 180     # Starting X position for the palette graphic
#     start_y = 2500    # Starting Y position for the palette graphic

#     for i in range(5):
#         color = (palette[i*3], palette[i*3+1], palette[i*3+2])
#         block_x = start_x + (block_size + padding) * i
#         draw.rectangle([block_x, start_y, block_x + block_size, start_y + block_size], fill=color)

#     # Show the poster with the image and palette graphic
#     poster.show()

    
#     # # Custom font style and font size
#     # myFont = ImageFont.truetype('FreeMono.ttf', 65)
    
#     # # Add Text to an image
#     # I1.text((10, 10), "Nice Car", font=myFont, fill =(255, 0, 0))
    
#     # # Display edited image
#     # img.show()
    
#     # # Save the edited image
#     # img.save("car2.png")

import math

def color_distance(c1, c2):
    # Calculate Euclidean distance between two RGB colors
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(c1, c2)))

def pick_distinct_colors(palette, num_colors):
    # Extract RGB tuples from the palette
    colors = [(palette[i], palette[i+1], palette[i+2]) for i in range(0, len(palette), 3)]
    
    # Start with the first color
    selected_colors = [colors[0]]
    
    for _ in range(1, num_colors):
        next_color = max(colors, key=lambda c: min(color_distance(c, sc) for sc in selected_colors))
        selected_colors.append(next_color)
        colors.remove(next_color)
    
    return selected_colors

def generatePoster(image, album_name, artist_name, tracklist):
    # Create the poster with a background color
    poster = Image.new('RGB', (2480, 3508), (222, 216, 206))

    # Resize the image and paste it on the poster
    img_resized = image.resize((2120, 2120))
    poster.paste(img_resized, (180, 180))

    # Generate a color palette with more colors to choose from
    paletted = image.convert('P', palette=Image.ADAPTIVE, colors=20)
    palette = paletted.getpalette()

    # Pick 5 distinct colors from the palette
    distinct_colors = pick_distinct_colors(palette, 5)

    # Draw the palette graphic on the poster
    draw = ImageDraw.Draw(poster)
    block_height = 60  # Height of each color block
    block_width = 210   # Width of each color block
    start_x = 1240       # Starting X position for the palette graphic
    start_y = 2400      # Starting Y position for the palette graphic

    for i, color in enumerate(distinct_colors):
        block_x = start_x + block_width * i
        draw.rectangle([block_x, start_y, block_x + block_width, start_y + block_height], fill=color)

    # Load the font
    font_path = "./DrukWideBold.ttf"
    font_title = ImageFont.truetype(font_path, 80, encoding="unic")
    font_subtitle = ImageFont.truetype(font_path, 50, encoding="unic")
    font_text = ImageFont.truetype(font_path, 40, encoding="unic")


    # Draw the artist name
    draw.text((180, 2400), artist_name, font=font_subtitle, fill=(0, 0, 0))

    # Draw the album name
    draw.text((180, 2550), album_name, font=font_title, fill=(0, 0, 0))

    # Draw the tracklist
    tracklist_text = "\n".join(tracklist)
    draw.text((180, 2650), tracklist_text, font=font_text, fill=(0, 0, 0))

    # Show the poster with the image and palette graphic
    poster.show()

