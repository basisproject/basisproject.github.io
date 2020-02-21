---
layout: post
title: "Inner workings of banking (a rough draft)"
author: "Andrew Lyon"
leader:
  image: "https://upload.wikimedia.org/wikipedia/commons/8/87/WinonaSavingsBankVault.JPG"
---

This will be short and sweet, but I just wanted to go over some recent changes to [the banking section of the paper][1]. And when I say changes I mean actually writing it in the first place.

There are two main problems:

- What price do we charge for products leaving the network into the market?
- How do we make sure that we make more capital than we spend?

The two problems are very related, and both have the same solution: currency tracking. Where before, products and services were costed based on labor and resources, now we track a separate category as well: currencies.

So if a bank lends $10000 to a member company, and they use that to buy steel from the market to make their widgets, the widgets will have not only labor content (of the workers making them) but also currency content. If we buy $100 worth of steel and use it to make 5 widgets, then each widget has $20 worth of currency cost. If another member company orders one of these widgets, the widgets cost (including the currency cost) is added to the company's overall costs, and their productive outputs will also have the currency cost imbued in them, and the cost moves through the internal economy.

Given that we know the conversion rate of network credits to local currency, and we know how much actual currency is included in the product (because we tracked it), it follows that we also know the *at-cost market value* of the product.

So if we want to sell this product into the market, we know what we must price it at in order to cover all costs of production. Everything above that price becomes regional profit. As far as what price to use, it would be nice if there was a way to automate this, however in all reality the company itself would be responsible for setting this based on their industry-specific knowledge. The regional production cost would serve as a pricing floor (possibly a soft one, TBD).

There's more detail and nuance in here, but a good amount of it is covered in the paper's new banking chapter! Keep in mind this is still evolving and may change in a way that makes this post irrelevant.

[1]: {{ "/paper#chapter-6-banking" | prepend: site.baseurl }}


