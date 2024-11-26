import numpy as np
from PIL import Image
from tqdm import tqdm


def parse_dat_file(dat_file_path):
    """Parses a .dat file to extract metadata."""
    config = {}
    with open(dat_file_path, "r") as f:
        for line in f:
            if ":" in line:
                key, value = line.strip().split(":", 1)
                config[key.strip()] = value.strip()
    return config


def process_raw_to_image(dat_file, output_file, downscale_factor=2, slice_skip=2, reverse=False, color_cut=0, color_pre_cut=0, color_augment=0):
    """Processes a .raw file into a downscaled and sliced 2D image based on its .dat configuration."""
    # Parse .dat file for configuration
    config = parse_dat_file(dat_file)

    # Extract parameters from the config
    raw_file_path = config.get("ObjectFileName")
    resolution = tuple(map(int, config.get("Resolution").split()))
    dtype_map = {"UCHAR": np.uint8, "USHORT": np.uint16}  # Extendable for other formats
    dtype = dtype_map.get(config.get("Format"))

    if not raw_file_path or not resolution or not dtype:
        raise ValueError("Missing required configuration in .dat file.")

    width, height, depth = resolution
    print(f"width {width}, height {height}, depth {depth}")

    # Compute scaled dimensions
    scaled_w, scaled_h = width // downscale_factor, height // downscale_factor

    # Compute scaling factor to maintain proportions
    scaled_width = int(width * (width / depth) // downscale_factor // 2)
    scaled_height = int(height * (height / depth) // downscale_factor // 2)

    if width == depth and height == depth:
        scaled_width = scaled_w
        scaled_height = scaled_h

    # Load the .raw file
    print(f"Load phase of '{raw_file_path}'")
    with open(raw_file_path, "rb") as f:
        data = np.frombuffer(f.read(), dtype=dtype)

    # Reshape into 3D volume
    print("Reshape phase")
    volume = data.reshape((depth, height, width))

    # Max value for uint16
    max_value = np.iinfo(dtype).max

    # Reduce the number of slices by skipping
    reduced_volume = volume[::slice_skip, :, :]
    reduced_depth = reduced_volume.shape[0]

    # Determine grid dimensions for the output image
    grid_cols = int(np.ceil(np.sqrt(reduced_depth)))
    grid_rows = int(np.ceil(reduced_depth / grid_cols))
    output_width = grid_cols * scaled_w
    output_height = grid_rows * scaled_h

    # Create an empty image to hold all slices
    output_image = Image.new("L", (output_width, output_height))
    # Process each slice
    for i in tqdm(range(reduced_depth), desc="Processing slices"):
        # Resize the slice
        if dtype == np.uint16:
            slice_data = reduced_volume[i, :, :]
            # Convert uint16 to uint8 -> [0, 255]
            normalized_slice = ((slice_data / max_value) *  255).astype(np.uint8)

            # Remove noise.
            normalized_slice = np.where(normalized_slice <= color_pre_cut, 0, normalized_slice)
            # Augment all the colors.
            normalized_slice = normalized_slice + color_augment
            # Remove some colors.
            normalized_slice = np.where(normalized_slice <= color_cut, 0, normalized_slice)

            slice_2d = Image.fromarray(normalized_slice, mode="L").resize((scaled_width, scaled_height))
        else:
            slice_2d = Image.fromarray(reduced_volume[i, :, :], mode="L").resize((scaled_width, scaled_height))

        # Create a blank canvas (with black border)
        canvas = Image.new("L", (scaled_w, scaled_h))
        paste_x = (scaled_w - scaled_width) // 2
        paste_y = (scaled_h - scaled_height) // 2

        # Paste the resized slice into the canvas
        canvas.paste(slice_2d, (paste_x, paste_y))

        # Calculate grid position
        if reverse:
            row = (reduced_depth - i) // grid_cols
            col = (reduced_depth - i) % grid_cols
        else:
            row = i // grid_cols
            col = i % grid_cols
        x_offset = col * scaled_w
        y_offset = row * scaled_h

        # Paste the resized slice into the output image
        output_image.paste(canvas, (x_offset, y_offset))

    # Save the output image
    image_name = f"{output_file}{grid_cols}x{grid_rows}_{scaled_w}x{scaled_h}.png"
    output_image.save(image_name)
    print(f"L'image a été sauvegardée sous le nom '{image_name}'")


# 512x512x512 -> hazelnuts/hnut_uint.dat
# process_raw_to_image("hazelnuts/hnut_uint.dat", "hazelnut_slices", 1, 1) # High quality
# process_raw_to_image("hazelnuts/hnut_uint.dat", "hazelnut_slices", 2, 2) # Normal quality
# process_raw_to_image("hazelnuts/hnut_uint.dat", "hazelnut_slices", 4, 4) # Low quality

# 1024x1024x1024 -> flower/flower_uint.dat
# process_raw_to_image("flower/flower_uint.dat", "flower_slices", 2, 2) # High quality
# process_raw_to_image("flower/flower_uint.dat", "flower_slices", 4, 4) # Normal quality
# process_raw_to_image("flower/flower_uint.dat", "flower_slices", 8, 8) # Low quality

# 1024x1024x1546 -> beechnut/beechnut_uint.dat
# process_raw_to_image("beechnut/beechnut_uint.dat", "beechnut_slices", 2, 3, True, 50) # High quality
# process_raw_to_image("beechnut/beechnut_uint.dat", "beechnut_slices", 4, 6, True, 50) # Normal quality
# process_raw_to_image("beechnut/beechnut_uint.dat", "beechnut_slices", 8, 12, True, 50) # Low quality

# 2048x2048x2048 -> woodbranch/woodbranch_uint.dat
# process_raw_to_image("woodbranch/woodbranch_uint.dat", "woodbranch_slices", 4, 4, True, 50, 5, 50) # High quality
# process_raw_to_image("woodbranch/woodbranch_uint.dat", "woodbranch_slices", 8, 8, True, 50, 5, 50) # Normal quality
# process_raw_to_image("woodbranch/woodbranch_uint.dat", "woodbranch_slices", 16, 16, True, 50, 5, 50) # Low quality

