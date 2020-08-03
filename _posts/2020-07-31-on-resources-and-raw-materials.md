---
layout: post
title: "On resources and raw materials"
author: "Andrew Lyon"
leader:
  image: '/assets/images/logging-forest.jpg'
---

Tracking of resources and raw materials is a vital part of Basis, but what does that mean? How does it work?

A good place to start might be reading our post on [cost tracking without money][costs]. But in case you haven't (or don't want to), the idea here is that for each product we know the exact resources it took to make it. So if we make a chair, we might know how many grams of wood it took to make, how many grams of iron or steel were used in the screws that hold it together, how many liters of diesel fuel it took to ship it, etc.

When we have this broken down for us, there are a number of great things we can do both individually and systemically. On the per-product level, we can make decisions based on things that a price obscures: do I want the chair that used more wood or the chair that used more fossil fuels? Having this information makes it easier for producers *and* consumers to make more ecological decisions based on their own preferences.

But taking it further, if a you want to buy a chair, it makes sense that the ultimate price of the chair might be the sum of the labor it took to produce it. However, the chair also has a resource cost. What if we had the ability to set a price on various resources based on things like scarcity and known externalities?

All of a sudden this opens up a lot of possibilities. As a network, we could slowly set a higher price on things like fossil fuels over time, which puts an incentive on the entire network to find more efficient energy methods. A region that suddenly has a shortage of water could raise the price of all water consumed in that area as a rationing method.

So we know what we can do with this information, but getting the information is tricky. Every resource we would want to track is effectively a product in the network. So a chair and a liter of crude oil are the same concept in the system. What we have to do then is to effectively tell the system we want to track a particular resource type and connect all those matching products to that resource.

This brings up a number of really interesting questions:

1. Tagging a product as a resource effectively means that the resource will cost more. How do we incentivize members (whether they are tagging their own product or someone else's product) to provide this information?
1. Once it's proposed that a product might be tagged as a resource, what process is in place to either confirm or deny this connection? The process necessarily needs to be democratic, but participation needs to be incentivized. How do we reward members for lending their time to this internal service, but also reward for accuracy?
1. How do we collectively decide *what* to track? Crude oil might be good to track, but once it's transformed into gasoline, diesel, jet fuel, etc it doesn't necessarily make sense to track each of those separate products as having a "crude oil" content. It would make more sense to capture that transformation and have each of those separate outputs be their own tracked resource. Where do we stop, though? Do we need to know how many screws make up a chair or can we be content knowing the steel content of that chair instead? What resource transformations do we build into the system? How do we incentivize the tracking of these transformations by the companies that perform these tasks?

While these questions aren't necessarily a burning priority for the project (might be quite a while before resource management is a problem we have), it's good to start thinking about these issues.

If you're interested in systemic resource management, join our discussions on [the resource plan][plan] or [resource tagging][tagging].

[costs]: {{ '/posts/2020/05/cost-derivation/' | prepend: site.baseurl }}
[plan]: https://github.com/basisproject/tracker/issues/58
[tagging]: https://github.com/basisproject/tracker/issues/17
