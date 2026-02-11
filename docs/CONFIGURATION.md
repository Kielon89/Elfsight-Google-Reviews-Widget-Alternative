# ⚙️ Configuration Reference

The `<google-reviews-widget>` custom element accepts several attributes to control its behavior and appearance.

## Attributes

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `src` | `string` | `reviews.json` | **Required.** The URL to the JSON file containing the review data. |
| `theme` | `string` | `light` | Sets the color scheme. Options: `light`, `dark`. |
| `layout` | `string` | `grid` | Sets the display layout. Options: `grid` (masonry), `carousel` (horizontal slider). |
| `lang` | `string` | `en` | Sets the language. See [Supported Languages](#supported-languages) below. |

## Supported Languages

The `lang` attribute accepts the following 2-letter codes:

| Code | Language |
| :--- | :--- |
| `en` | English (Default) |
| `fr` | French |
| `es` | Spanish |
| `de` | German |
| `it` | Italian |
| `pt` | Portuguese |
| `nl` | Dutch |
| `pl` | Polish |
| `ru` | Russian |
| `ja` | Japanese |
| `ko` | Korean |
| `zh` | Chinese |

## Examples

### Dark Mode Carousel
```html
<google-reviews-widget 
  src="path/to/reviews.json" 
  theme="dark" 
  layout="carousel">
</google-reviews-widget>
```

### Light Mode Grid
```html
<google-reviews-widget 
  src="path/to/reviews.json" 
  theme="light" 
  layout="grid">
</google-reviews-widget>
```
