from PIL import Image, ImageDraw
import os

def create_garden_icon(size):
    # Create a new image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background gradient effect (green)
    for i in range(size):
        color_intensity = int(70 + (20 * i / size))  # Gradient from darker to lighter green
        color = (76, color_intensity + 100, 80, 255)  # Green gradient
        draw.rectangle([0, i, size, i+1], fill=color)
    
    # Draw soil at bottom
    soil_height = int(size * 0.3)
    draw.rectangle([0, size - soil_height, size, size], fill=(141, 110, 99, 255))
    
    # Draw sun
    sun_x, sun_y = int(size * 0.15), int(size * 0.15)
    sun_radius = int(size * 0.08)
    draw.ellipse([sun_x - sun_radius, sun_y - sun_radius, 
                  sun_x + sun_radius, sun_y + sun_radius], 
                 fill=(255, 213, 79, 255))
    
    # Draw center flower (main focus)
    flower_x = size // 2
    flower_y = int(size * 0.5)
    petal_size = int(size * 0.08)
    
    # Stem
    stem_width = max(2, int(size * 0.02))
    draw.rectangle([flower_x - stem_width//2, flower_y, 
                    flower_x + stem_width//2, int(size * 0.75)], 
                   fill=(46, 125, 50, 255))
    
    # Petals (pink/red)
    petal_color = (238, 90, 111, 255)
    for i in range(6):
        angle = i * 60
        import math
        px = flower_x + int(petal_size * math.cos(math.radians(angle)))
        py = flower_y + int(petal_size * math.sin(math.radians(angle)))
        draw.ellipse([px - petal_size//2, py - petal_size//2,
                      px + petal_size//2, py + petal_size//2],
                     fill=petal_color)
    
    # Flower center (yellow)
    center_size = int(size * 0.06)
    draw.ellipse([flower_x - center_size//2, flower_y - center_size//2,
                  flower_x + center_size//2, flower_y + center_size//2],
                 fill=(255, 202, 87, 255))
    
    # Left plant
    plant1_x = int(size * 0.25)
    plant1_y = int(size * 0.55)
    
    # Stem
    draw.rectangle([plant1_x - stem_width//2, plant1_y, 
                    plant1_x + stem_width//2, int(size * 0.75)], 
                   fill=(46, 125, 50, 255))
    
    # Small flower
    small_petal_size = int(size * 0.05)
    for i in range(5):
        angle = i * 72
        import math
        px = plant1_x + int(small_petal_size * 0.7 * math.cos(math.radians(angle)))
        py = plant1_y + int(small_petal_size * 0.7 * math.sin(math.radians(angle)))
        draw.ellipse([px - small_petal_size//2, py - small_petal_size//2,
                      px + small_petal_size//2, py + small_petal_size//2],
                     fill=(255, 107, 157, 255))
    
    # Right plant (leaves only)
    plant3_x = int(size * 0.75)
    plant3_y = int(size * 0.6)
    
    # Stem
    draw.rectangle([plant3_x - stem_width//2, plant3_y, 
                    plant3_x + stem_width//2, int(size * 0.75)], 
                   fill=(46, 125, 50, 255))
    
    # Leaves
    leaf_color = (76, 175, 80, 255)
    leaf_size = int(size * 0.06)
    # Left leaf
    draw.ellipse([plant3_x - leaf_size, plant3_y - leaf_size//2,
                  plant3_x, plant3_y + leaf_size//2],
                 fill=leaf_color)
    # Right leaf
    draw.ellipse([plant3_x, plant3_y - leaf_size//2,
                  plant3_x + leaf_size, plant3_y + leaf_size//2],
                 fill=leaf_color)
    
    return img

# Create main directories if they don't exist
os.makedirs('resources', exist_ok=True)
os.makedirs('android/app/src/main/res/mipmap-hdpi', exist_ok=True)
os.makedirs('android/app/src/main/res/mipmap-mdpi', exist_ok=True)
os.makedirs('android/app/src/main/res/mipmap-xhdpi', exist_ok=True)
os.makedirs('android/app/src/main/res/mipmap-xxhdpi', exist_ok=True)
os.makedirs('android/app/src/main/res/mipmap-xxxhdpi', exist_ok=True)

# Generate icons
sizes = {
    'resources/icon.png': 1024,
    'android/app/src/main/res/mipmap-mdpi/ic_launcher.png': 48,
    'android/app/src/main/res/mipmap-hdpi/ic_launcher.png': 72,
    'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png': 96,
    'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png': 144,
    'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png': 192,
    'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png': 48,
    'android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png': 72,
    'android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png': 96,
    'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png': 144,
    'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png': 192,
}

for path, size in sizes.items():
    icon = create_garden_icon(size)
    icon.save(path, 'PNG')
    print(f"Created: {path} ({size}x{size})")

# Also create adaptive icons for Android
adaptive_sizes = {
    'android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png': 108,
    'android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png': 162,
    'android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png': 216,
    'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png': 324,
    'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png': 432,
}

for path, size in adaptive_sizes.items():
    icon = create_garden_icon(size)
    icon.save(path, 'PNG')
    print(f"Created adaptive: {path} ({size}x{size})")

print("\nAll icons generated successfully!")
print("The app icon has been updated for Android.")