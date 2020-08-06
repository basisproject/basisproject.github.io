---
layout: post
title: "Rethinking regions and companies: an exploration in self-organization"
author: "Andrew Lyon"
leader:
  image: '/assets/images/region-map-drawing.png'
---

The concept of regions in Basis is as old as the project itself. Originally intended as a container for federation, the idea is to group people, companies, and assets into somewhat blurry geographical spaces (for instance a city or county). After some incredibly interesting feedback and discussion about the project, I'm no longer convinced this is the best way forward.

Regions as they exist in the project are somewhat brittle. There's a concept of individual members, companies, and regions. If we define things in these terms, it can make sense on a small scale, but there are issues with this model:

- If I'm a member of a company in region A, but my housing is in region B, I'm breaking the geographical model of regions.
- If two regions want to build something together (a bridge over a river that divides them) or invest into a public company together, it breaks the geographical model.

In the paper as it exists now, there's a small section that's basically a TO-DO describing how regions might overcome these problems and coordinate their efforts on an extra-regional scale. In other words "we'll figure out these strange and difficult problems later." There's a [discussion issue](https://github.com/basisproject/tracker/issues/75) going over how membership might work in a more fluid way, but it still suffers from some similar problems.

On top of this, regions have this idea of asset management and permissions surrounding it, but when I started to build out the company model in more detail, I realized [companies have this same concept](https://github.com/basisproject/tracker/issues/74). Who gets to use what, and in what capacity? The decision making processes around assets are identical for both companies and regions. Hmm.

Lastly, regions can own assets, which naturally means regions (like companies) can incur costs. How are those costs handled? What is the meaning of these costs if they are regional vs assigned to a producing entity?

## Rethinking regions

What if we merge the idea of companies and regions and slightly alter how membership works? Let's define a new model for companies.

A company is a container of agents and assets. An agent can be either an individual member (a person), or another company. The assets of that company are owned collectively by the people making up that company (including the people members of its sub-companies) and use of those assets and permissions surrounding use is decided based on criteria set by those people. Any agent can be a member of any number of companies.

As an example, a farming company might have a number of farmers (either individual farmers or farming companies) that owns some amount of land and productive equipment like tractors. The members of that larger company all have a say in how the farm land is managed over time, how the land is divvied up between them, who gets use of what tractors and for how long, etc. Some of these farmers might also be members of a housing company that owns houses and apartments, which would give them access to local housing. Both companies might have their own membership criteria, such as working or residing in the particular area the company covers.

Already we've devised two companies that a region might have encompassed in the previous model, but in such a way that farmers get to decide farmer things, and members needing housing get to decide on housing things. The two groups might intersect, but they also might not. Regions forced the intersection, and gave an office worker a say over farm land & equipment, which in most cases doesn't make sense.

I want to note something: if company X has three members, person A and B and company Y, and company Y has two members, person A and C, then A, B and C all have an equal say in the issues relating to company X. A being a member of both X and Y doesn't change A's decision power in relation to the other people. In other words, membership might be agent-based (people or companies), but ultimate decision power *rests only with people* (companies as entities have no decision power).

## Rethinking capital distribution between companies

One thing that struck me when mulling this model over was the idea that regions aggregated capital in such a way that all market-derived profits from all the companies in a region fed into a larger regional pool that could be used for anything, whether buying farmland, houses, or tractors from the capitalist markets. While this is not an issue when the network gets critical mass and can produce all of its needs internally, it is certainly a concern when interaction with the outside market system is essential.

With the new company model, the idea of automatic pooling of regional profits gets eroded. Farms that make a market profit might keep the profit in their own farming company, and people who need housing wouldn't have the money to buy/build houses. What is to be done?

What if every company has its own pool of capital, and each membership in a company acts as a vector for capital distribution between these pools?

Let's say I'm a member of two companies: a farming company that has 100 members, and a housing company that has 1000 members. In a sense, I have a `1/100` say in the farm company and a `1/1000` say in the housing company. If the farm makes a profit of $1000 (and we can tell profit easily and immediately because we track *all costs of production*) then it would follow that I have a say in `$1000 / 100` of that capital, or $10. Because I'm a member of two companies (the farm and housing company) that $10 capital would automatically be split between them both such that they each get $5.

On the flip side, let's say the housing company I'm a `1/1000` member of has more housing than is needed to house all members, so they rent units out on the market at a profit-generating rate. If the housing company makes `$8000` of profit in a month, it follows that I control `$8000 / 1000` of that capital, or `$8`. Half of this becomes available for the farm company I am a member of.

In this way, membership in companies becomes a vector for market purchasing power to move freely between companies, and does so *without distributing to members individually*. In effect, production is still profitless internally and market success in one company is shared with others through membership.

You might ask what happens if I'm a member of three or four companies. Does the $10 profit from the farm split four-ways equally? Can I choose the ratio to which this distribution occurs? This is an interesting question and a lot of dynamics around it arise that I've [discussed in this comment in the project tracker](https://github.com/basisproject/tracker/issues/72#issuecomment-668266377) (see "Concerns with this model" section). Discussion here is welcome either in the project tracker or [the project reddit](https://www.reddit.com/r/basisproject/).

## Rethinking banking

Although banking was somewhat loosely defined in the regional model both in [the paper]({{ '/paper#chapter-5-banking' | prepend: site.baseurl }}) and [another post]({{ '/posts/2020/02/inner-workings-of-banking/' | prepend: site.baseurl }}), with this new concept it now becomes even more loosely defined. I've made some [attempts at discussion](https://github.com/basisproject/tracker/issues/72#issuecomment-668266407) but am ultimately not sure of where this will land. Feedback, ideas, and discussion are all greatly appreciated.

The goal of the banking system is to facilitate

1. Seamless transactions between member companies and the market system in a way that integrates cost-tracking.
1. Conversion of internal credits to market currency (USD for instance) so members can personally buy things not produced in-network.

In other words, if capitalism and socialism are two different languages, banking is the translator between them.

The first item, seamless transactions, is a matter of being able to send capital from an internal pool to a market entity, which is mostly a solved problem.

Conversion of credits into market currency is the difficult problem. Effectively, for stability in the network's beginnings, you'd want a stable conversion rate (at likely a 1:1 ratio or perhaps something like 1000:999). This means having capital systemically set aside for withdrawals such that one credit is backed by one dollar. Where does this capital live? How many actual banks/credit unions are involved, and if multiple (which seems prudent), which funds come from which?

How this is managed on a systemic level is an interesting problem and remains a topic of discussion and thought.

## Conclusions

This new model of the general company is magnitudes more flexible than the previous idea of regions and is able to really capture the associations people might have in ways that don't make assumptions. Keep in mind, the old model could be easily implemented in the new model, so if it's something people want, they are able to decide that for themselves.

It's important to note that the most difficult parts of the problems we're solving revolve around capital itself, and that at the point capital is no longer required, ie the network can provide its own collective needs internally, large amounts of the system can simplify.

There is one piece we touched on above that hasn't been solved in this post. All companies will have costs they manage, and producing companies will have upper limits on how much costs they can manage at any given time. However, there are necessarily going to be public companies (ie, planned) that have costs themselves which are not required to flow through to the outputs of that company (ie, not consumer-demand driven). For instance, if a number of people band together and say "we want public pharma research" this new pharma company might have some amount of costs available to it that *do not need to be covered via consumption*. Where do these costs go if not covered by customers, and how are they handled? This is an important question and we'll tackle it soon.

