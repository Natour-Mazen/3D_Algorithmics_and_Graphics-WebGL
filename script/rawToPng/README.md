By AL NATOUR Mazen and HERVOUET Léo  
In Pycharm

# Python Script

This python script allow you to convert a .raw file from [Volume Datasets](https://www.ifi.uzh.ch/en/vmml/research/datasets.html) into 
a map of images. The .raw file is a representation in 3D of objects but in WebGL we cannot past this file into 
the shader, but we can past an image that have multiple images in it that represent the layers. 

The script use a .dat file, that describe the .raw file.
It is written like this (exemple of the hazelnuts object) : 

**hnut_uint.dat**
```
ObjectFileName:	hazelnuts/hnut512_uint.raw
TaggedFileName:	---
Resolution:	512 512 512
SliceThickness:	1.0 1.0 1.0
Format:	UCHAR
NbrTags:	0
ObjectType:	TEXTURE_VOLUME_OBJECT
ObjectModel:	I
GridType:	EQUIDISTANT
Modality:	unknown
TimeStep:	0
```

In the code we use **ObjectFileName**, **Resolution** and **Format**.

## How to use it

To convert your .raw into a .png you need to call the **process_raw_to_image** function. 
You have some exemples in the script to see how to use it.


```python
def process_raw_to_image(dat_file, output_file, downscale_factor=2, slice_skip=2, reverse=False, color_cut=0, color_pre_cut=0, color_augment=0):
```

**Param :**  
`dat_file` : the path to the .dat file.  
`output_file` : the output name.  
`downscale_factor` : the downscale factor to reduce the size of each image.  
`slice_skip` : the number of slice we preserve, the more, the less vertical slices you have (in the 3D image).  
`reverse` : if the image is reversed or not.  
`color_cut` : the threshold of color which will be reset to 0 (from 0 to your value), use it to clean your images (done after the color augment).  
`color_pre_cut` : the threshold of color which will be reset to 0 (from 0 to your value), use it like color_cut (done before the color augment).  
`color_augment` : augment all the images color with this specific value, use it if the colors are too low dark for exemple.  

## Config to run the script

Run the command `pip install -r requirements.txt` to install all the packages needed for this project. 

Run the command `pip freeze > requirements.txt` to get this file.  

## Links 

Links to download all the .dat and .raw used in this script :  
[hazelnuts.zip](http://files.ifi.uzh.ch/vmml/uct_datasets/hazelnuts.zip)  
[flower.zip](http://files.ifi.uzh.ch/vmml/uct_datasets/flower.zip)   
[beechnut.zip](http://files.ifi.uzh.ch/vmml/uct_datasets/beechnut.zip)  
[woodbranch.zip](http://files.ifi.uzh.ch/vmml/uct_datasets/woodbranch.zip)  

### Modification to the .dat files

**flower_uint.dat**
```
ObjectFileName:	flower/flower_uint.raw
TaggedFileName:	---
Resolution:	1024 1024 1024
SliceThickness:	1.0 1.0 1.0
Format:	UCHAR
NbrTags:	0
ObjectType:	TEXTURE_VOLUME_OBJECT
ObjectModel:	I
GridType:	EQUIDISTANT
Modality:	unknown
TimeStep:	0
```

**beechnut_uint.dat**
```
ObjectFileName:	beechnut/beechnut_uint.raw
TaggedFileName:	---
Resolution:	1024 1024 1546
SliceThickness:	1.0 1.0 1.0
Format:	USHORT
NbrTags:	0
ObjectType:	TEXTURE_VOLUME_OBJECT
ObjectModel:	I
GridType:	EQUIDISTANT
Modality:	unknown
TimeStep:	0
```

**woodbranch_uint.dat**
```
ObjectFileName:	woodbranch/woodbranch_uint.raw
TaggedFileName:	---
Resolution:	2048 2048 2048
SliceThickness:	1.0 1.0 1.0
Format:	USHORT
NbrTags:	0
ObjectType:	TEXTURE_VOLUME_OBJECT
ObjectModel:	I
GridType:	EQUIDISTANT
Modality:	unknown
TimeStep:	0

```