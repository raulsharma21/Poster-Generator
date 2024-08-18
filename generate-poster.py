from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont

 
background = Image.new('RGB', (2480, 3508), (222, 216, 206))
# background.show()


 
img = Image.open('kol-test.jpg')
print(img.size)

img_resized = img.resize((2120, 2120))
# background.paste(img_resized, (150, 150, 2180, 3208))

background.paste(img_resized, (180, 180))

background.show()



# # Call draw Method to add 2D graphics in  an image
# I1 = ImageDraw.Draw(img)
 
# # Custom font style and font size
# myFont = ImageFont.truetype('FreeMono.ttf', 65)
 
# # Add Text to an image
# I1.text((10, 10), "Nice Car", font=myFont, fill =(255, 0, 0))
 
# # Display edited image
# img.show()
 
# # Save the edited image
# img.save("car2.png")