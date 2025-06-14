# Asciidoctor Anywhere Footnote

## Introduction

We've all been there: you're out in the pouring rain with a flat battery.
What's worse, when you pop the boot, you realize that you've left the spare charging in the garage.
And to top it all, you still have that AsciiDoc table you're working on that's going to need footnotes
-- and it's a real bind to make them show up near the table, instead of right at the end of the page.

Well, there's little you can do about the rain and the flat battery, but there may be something you can do about the footnotes. …

## Anywhere Footnote

This is an inline macro that you can use in most places that you'd be able to use `footnote`.
The main difference is that it includes a parameter that it uses to reference the location of the footnote block:

```asciidoc
This is a piece of text{empty}afnote:footnote-block[This is the text of the footnote.]
```


The macro parameter (`footnote-block`) points to the `afnote` block where the footnote will be rendered:

```asciidoc
This is where the footnote block goes:

afnote:footnote-block[]
```

> [!NOTE]
> As you can see, the rendering `afnote` is an inline macro, denoted by a single colon (`:`)

All the footnotes with the same identifier will be rendered in the same block,
so you can have multiple footnote blocks on your page.

The inline tag (single colon) supports extra parameters, as well as the text for the footnote.

```
afnote:my-block[Footnote text] // (1)
afnote:my-block[reftext="Footnote text", refid="footnote-id"] // (2)
afnote:my-block[refid="footnote-id"] (3)
afnote:my-block[reftext="Footnote text", marker="*"] (4)
afnote:my-block[reftext="Footnote text", lbrace="(" rbrace=")"] (5)
```


1. The standard pattern. The text in brackets will be used as the footnote.
2. You can also set the footnote text using the `reftext` parameter. In this case we are also using the `refid` to set a reusable reference identifier.
3. The `refid` is used to reference an existing footnote so that multiple footnote references can point to the same footnote.
4. Normally, the footnotes are numbered per block, but if you wish, you can assign your own marker for any footnote.
5. The footnotes are marked with a plain number by default, but you can wrap the number in braces by setting the `lbrace` and `rbrace` parameters.

> [!TIP] 
> You don't have to use both parameters. If you set `rbrace=")"`, for example, you can footnote marked like this: `1)`

## The Stylesheet

The footnotes and the footnote block are rendered in HTML with an attached style (`anywhere-footnote`).
It's included here for reference:

```css
.anywhere-footnote  {
    vertical-align: super;
    font-size: 75%;
    font-weight: bold;
    text-decoration: none;
}
```
