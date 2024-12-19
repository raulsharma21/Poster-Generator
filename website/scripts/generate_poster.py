from PIL import Image, ImageDraw, ImageFont
import math

def color_distance(c1, c2):
    # Calculate Euclidean distance between two RGB colors
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(c1, c2)))

def hexToRGB(hex_color):
    hex_color = hex_color.lstrip('#')  # Remove '#' if it's present
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

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


def resizeAndPasteImage(image, poster, size, position):
    """Resize the image and paste it onto the poster."""
    img_resized = image.resize(size)
    poster.paste(img_resized, position)
    return img_resized

def drawLines(draw, y_positions, line_thickness=15, color=(0, 0, 0)):
    """Draw lines at specified positions."""
    width = 2120
    x_start = 180
    for y_position in y_positions:
        draw.line([(x_start, y_position), (x_start + width, y_position)], fill=color, width=line_thickness)

def drawColorPalette(draw, distinct_colors, start_x, start_y, block_width, block_height):
    """Draw color palette blocks."""
    for i, color in enumerate(distinct_colors):
        block_x = start_x + block_width * i
        draw.rectangle([block_x, start_y, block_x + block_width, start_y + block_height], fill=color)

def rightAlignText(draw, text, font, right_align_x, y_position, color=(0, 0, 0)):
    """Draw right-aligned text."""
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_x = right_align_x - text_width
    draw.text((text_x, y_position), text, font=font, fill=color)

def calculateTracklistSpacing(start_y, end_y, num_tracks):
    """Calculate dynamic spacing for the tracklist."""
    if num_tracks < 5:
        extra_margin = (5 - num_tracks) * 200
        start_y += extra_margin // 2
        end_y -= extra_margin // 2
    available_height = end_y - start_y
    return available_height // num_tracks, start_y

def drawTracklist(draw, tracklist, font, start_y, end_y, color=(0, 0, 0)):
    """Draw the tracklist with dynamic spacing."""
    tracklist_spacing, tracklist_y_position = calculateTracklistSpacing(start_y, end_y, len(tracklist))
    for track in tracklist:
        draw.text((180, tracklist_y_position), track, font=font, fill=color)
        tracklist_y_position += tracklist_spacing

def generatePoster(bg_color, image, album_name, artist_name, tracklist, scannable, copyright_text):
    """Main function to generate the poster."""
    # Create the poster
    rgb_color = hexToRGB(bg_color)
    poster = Image.new('RGB', (2480, 3508), rgb_color)
    draw = ImageDraw.Draw(poster)

    # Resize and paste the image
    resizeAndPasteImage(image, poster, (2120, 2120), (180, 130))

    # Draw lines
    drawLines(draw, [70, 3450])

    # Generate color palette
    paletted = image.convert('P', palette=Image.ADAPTIVE, colors=20)
    palette = paletted.getpalette()
    distinct_colors = pick_distinct_colors(palette, 5)

    # Draw color palette
    drawColorPalette(draw, distinct_colors, start_x=1240, start_y=2400, block_width=210, block_height=40)

    import os
    print("Current working directory:", os.getcwd())

    bold_path = "../fonts/kollektif/Kollektif-Bold.ttf"
    heavy_path = "../fonts/kollektif/Kollektif-Bold.ttf"
    regular_path = "../fonts/kollektif/Kollektif.ttf"
    italic_path = "../fonts/kollektif/Kollektif-Italic.ttf"
    
    font_title = ImageFont.truetype(heavy_path, 120, encoding="unic")
    font_subtitle = ImageFont.truetype(bold_path, 120, encoding="unic")
    font_text = ImageFont.truetype(regular_path, 40, encoding="unic")
    font_italic = ImageFont.truetype(italic_path, 30, encoding="unic")

    # Right-align artist and album name
    right_align_x = 2480 - 180  # Define the rightmost alignment position
    rightAlignText(draw, artist_name, font_subtitle, right_align_x, 2550)
    rightAlignText(draw, album_name, font_title, right_align_x, 2740)

    # Draw tracklist
    drawTracklist(draw, tracklist, font_text, start_y=2330, end_y=3420)

    # Draw scannable
    scannable_width, scannable_height = scannable.size
    poster.paste(scannable, (right_align_x - scannable_width, 3230))


    # Draw copyright text
    rightAlignText(draw, copyright_text, font_italic, right_align_x, 3380)

    # Show the poster
    poster.show()