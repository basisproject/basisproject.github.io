---
layout: post
title: "Cost derivation: In-kind cost tracking in moneyless production"
author: "Andrew Lyon"
leader:
  image: '/assets/images/stocks.jpg'
---

I've been asked many times what Basis does, and when I say it tracks costs of production without money, it can cause confusion. How can something cost anything without money?

When you think about the _price_ of some thing (say, a chair) what does that price mean? In our current system, it means that at each node in the economic network (the logging company, the lumber yard, the chair factory, the reseller) there was some process that took place that essentially derived the cost of the Thing they were selling by tallying up the inputs they bought. That's not the only story though: they add (or subtract, in many cases) another value, which is the margin of the sold item.

So for each company involved in making the chair, the price looks like `inventory + labor + margin`. Now repeat this for every hop of the supply chain until you're driving home with your brand new chair in your McLaren F1 after having paid the chair's price of $35.99.

What does $35.99 mean? Nothing! The chair didn't _cost_ $35.99 to make, otherwise there would be no margin on any of the sales in the supply chain. But what if there was no margin? If all companies involved made no profit or loss, what does $35.99 mean? Effectively, it's an aggregate sum of the labor and resources that went into building and shipping the chair and its constituent inputs (yes, I know of marginal economics, but if you want to argue that price isn't derived from labor and resources, then you're just proving my point even more that price is meaningless).

Now, let's say we want to deconstruct that $35.99. I want to know _how much wood_ is in it. I want to know how much fuel was used to transport it and its inputs. I want to know the costs of leadership, machining, sales, accounting, etc. How would we do this? We would need to open the books of all the companies involved and trace back from the moment it was sold back to the logging company. But this is an impossible task, because even if you could obtain this data from just the participants in the direct supply chain, there are offshoots that need to be accounted for. For instance, the logging company might have used a chainsaw to cut down the tree used in your chair. The cost of that chainsaw is _imbued_ in the chair, so now you have to examine the entire supply chain for the chainsaw! And what about the truck that delivers the chair to the showroom? A complex machine with a vast supply chain (not to mention the fuel it uses to operate, which also has its own supply chain). All of a sudden, deriving cost requires traversing data on a vast network with recursive temporal loops and shifting complexity.

This is where Basis comes in.

## Disaggregate cost tracking

Basis operates on a company level (ie, the single node of the economic network). It knows the inputs and outputs of a company (by facilitating the orders between them) and using this information accurately tracks costs, in disaggregate, of labor by occupation and resources (raw and semi-raw materials).

Now when you buy your chair, it no longer costs $35.99, but rather it costs 4kg wood, 3L diesel fuel, 4g silicon, 0.3 hours of logger time (at $20/hr), 0.6 hours of machinist labor (at $22/hr), etc etc.

## But, why?

The purpose of doing this is not just to derive a fancy way of determining price, but to collect and store information on the _cost of producing_ something. If we know how much fossil fuels were burned to transport it, or how much money was spent on marketing to convince you to want it, or what wages people were paid to build it, both producers and consumers could make much more informed decisions based on ecology and personal preference.

Pair this with production that doesn't rely on profit for continued existence, and you have an economic system that, while realistically will not account for all externalities, at least does not grossly incentivize them.

## So what does a "price" in Basis look like?

A bit like this:

```
{
    "labor": {
        "ceo": 1.2,
        "cfo": 0.6,
        "machinist": 2.3
    },
    "labor_hours": {
        "ceo": 0.03,
        "cfo": 0.02,
        "machinist": 0.115
    },
    "resources": {
        "wood": 5612,
        "steel": 12,
        "diesel": 0.87
    }
}
```

The final price would be a combination of the `labor` costs in addition to `resources` costs. Resources is a measure of the _amount_ of each resource in standard units, not its final _price_. The price of resources is democratically decided at both the global level and regional level, such that the per-unit cost of each resource becomes effectively a labor cost (credits) and can be added to the labor values sum.

So above, if wood was 0.0004 credits/g, steel was 0.1 credits/g, and diesel 1.5 credits/L, then our total cost in credits would be `1.2 + 0.6 + 2.3 + (5612 * 0.0004) + (12 * 0.1) + (0.87 * 1.5) = 8.8498`. If you have `8.8498` credits, the great job, you can afford to buy this widget.

In the cost list, `labor_hours` is currently just used for tracking and has no bearing on pricing.

---

<small>(Apologies for the douchey header image, our marketing team has mandated that all blog posts have a picture)</small>

