---
layout: post
title: "July 2020 Basis project status update"
author: "Andrew Lyon"
leader:
  image: '/assets/images/marx-glasses.jpg'
---

Hey, y'all. Wanted to give a quick project update on direction and progress.

## Core

As you all undoubtedly know, the [Basis core project][core] is now underway. There are a number of pieces being worked on right now. First, economics, determines how costs flow through the system and as they move from company to company. This work is going well and is coming up on having a first version done. The idea here is that costs cannot be destroyed, only assigned to resources that are passed on to other producers ("companies"): everything has a cost to produce, and that cost moves with it through the economic network.

The next portion of the core after economics is governance. This is the concept of democracy and voting in the system: self-determination. When we talk of voting, it's not the horrid First Past The Post one-person-one-vote we're all familiar with, but ideally a wide range of voting mechanisms (referendum, consensus, council, STV, etc) that people can mix and match to meet their needs. The problem with voting is its inherent reliance on various cryptographic primitives and algorithms that might change when moving between storage mechanisms. In other words, voting itself cannot be modeled in the core because of the core's deliberate shirking of integrating with any one particular storage mechanism/blockchain. As such, work is going to be done on effectively creating a [voting user in the core][voting] that can take action on behalf of the result of a vote which happens elsewhere. This will allow us to start testing various situations where "a vote was held and decided" without needing to explicitly model that voting scenario.

This is all part of the effort to make Basis a self-determined network: the goal is to remove all admins or special privileges and instead give every user the same amount of power.

Once we have to ability to model successful votes, a number of wonderful new possibilities opens up without the need for an authoritarian presence in the network. Things like [mediating usage of shared resources][resources] or [determining who can do what within a company][permissions].

## A new model for companies

We went over this extensively in [the last post][regions], but it's worth touching on again. The project is moving toward a more general model of companies that incorporate the ideas of what used to be regions. While this leaves a few questions unanswered, it also answers many others that were lingering from the old model. Overall this is a positive change and worth the effort to restructure.

Two of the biggest remaining questions surrounding this are 

1. How does banking operate within this new system?
1. How does this change the concept of property usage and management in Basis?

A lot of ongoing work is happening to answer these questions.

## Cybernetics

A new avenue of exploration has opened up to the project, and that's the idea of [cybernetics]. While many view cybernetics as a way to fully automate an entire economy, our use is much more minimal. The idea is to use a number of metrics about how companies in the network perform to automatically adjust how much costs they can command. In effect, it's a systemic control that optimizes how much societal investment a company should have depending on its ongoing performance. The goal is to incentivize things that are good for the network and reward companies for doing these things by allowing them more of what would be the equivalent of "purchasing power" in the capitalist market.

While this remains a somewhat new field to the project, I suspect over time it will become more important as more avenues open up for systemic self-regulation.

## The paper

It's worth mentioning that in the last month or two, the project has undergone a lot of philosophical changes and most of these are absent in the paper. If you've read the paper, to get the most up to date understanding of the pending changes in the project, [check out the "paper" label][paperchanges] in the project tracker.

That's it! Thanks for reading. As always, if you have questions or ideas, the [Basis community][community] is here for you, or feel free to join in on any of the [ongoing discussions][discussions] in the project tracker!

[core]: https://gitlab.com/basisproject/core
[vf]: https://valueflo.ws/
[voting]: https://gitlab.com/basisproject/tracker/-/issues/87
[resources]: https://gitlab.com/basisproject/tracker/-/issues/86
[permissions]: https://gitlab.com/basisproject/tracker/-/issues/74
[cybernetics]: https://gitlab.com/basisproject/tracker/-/issues?label_name%5B%5D=tag%3Acybernetics
[regions]: {{ '/posts/2020/07/rethinking-regions-and-companies/' | prepend: site.baseurl }}
[paperchanges]: https://gitlab.com/basisproject/tracker/-/issues?label_name%5B%5D=project%3Apaper
[community]:https://www.reddit.com/r/basisproject/
[discussions]: https://gitlab.com/basisproject/tracker/-/issues?label_name%5B%5D=type%3Adiscussion

