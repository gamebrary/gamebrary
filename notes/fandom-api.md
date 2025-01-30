https://doom.fandom.com/api.php?action=query&titles=Doom_(2016)&prop=info|extracts|categories|links|images|revisions|pageprops|extlinks&explaintext=1&rvprop=content&format=json

To get the **full image URLs**, you need to use the **imageinfo** property in the MediaWiki API. Here’s how you can modify your request to retrieve the direct image URLs:

---

### **Step 1: Get the List of Images**
Use this API request to fetch all images on the page:

```
https://doom.fandom.com/api.php?action=query&titles=Doom_(2016)&prop=images&format=json
```

This will return a list of image filenames, like:

```json
{
  "query": {
    "pages": {
      "12345": {
        "title": "Doom (2016)",
        "images": [
          { "title": "File:Doom2016_cover.jpg" },
          { "title": "File:Doom2016_screenshot.png" }
        ]
      }
    }
  }
}
```

---

### **Step 2: Get Full Image URLs**
Now, use the **imageinfo** property to get the full URLs of these images:

```
https://doom.fandom.com/api.php?action=query&titles=File:Doom2016_cover.jpg|File:Doom2016_screenshot.png&prop=imageinfo&iiprop=url&format=json
```

#### **Expected Response:**
```json
{
  "query": {
    "pages": {
      "67890": {
        "title": "File:Doom2016_cover.jpg",
        "imageinfo": [
          { "url": "https://static.wikia.nocookie.net/doom/images/doom2016_cover.jpg" }
        ]
      },
      "67891": {
        "title": "File:Doom2016_screenshot.png",
        "imageinfo": [
          { "url": "https://static.wikia.nocookie.net/doom/images/doom2016_screenshot.png" }
        ]
      }
    }
  }
}
```

---

### **Automating the Process**
1. **First request:** Get the image titles.
2. **Second request:** Use those titles to fetch the full image URLs with `imageinfo`.
3. **Use in Gamebrary:** Store and display the images in your UI.

Would you like a JavaScript script to automate this for Gamebrary? 🚀