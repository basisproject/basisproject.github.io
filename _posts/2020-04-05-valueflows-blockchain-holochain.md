---
layout: post
title: "ValueFlows, Holochain, and blockchain"
author: "Andrew Lyon"
leader:
  image: '/assets/images/holochain.jpg'
---

After spending some time sharing the Basis project with others, I ended up catching wind of some really interesting projects that could augment the abilities of Basis quite a bit.

## ValueFlows

The first, and probably most impactful, is [ValueFlows][1]. It's effectively a language/vocabulary to describe economic networks and processes, evolved from the [REA][2] system of accounting. After reading through the website and documentation, I realized that it's a much more detailed and thought-out set of processes than what exists in Basis. Interestingly enough, I did a lot of research before starting Basis to find "standards" or best practices for ordering systems and supply chain automation, but had trouble finding anything that felt applicable.

ValueFlows is the exact thing I wish I had found before starting work on Basis. That said, none of it was wasted work, but rather it would be taking the incomplete work I had already started and finishing it with some level of standardization.

On top of this, while Basis touches on the idea of resource tracking, one thing it has yet to model is the concept of resource transformation. In other words, crude oil might be a tracked resource, but once refined, it is used up and transformed into several other different types of resources. Transformations are modeled into ValueFlows, although there's not a mechanism to make sure the outputs match the inputs, which Basis tries to do very carefully, so transformations would still need some level of standardization and scrutiny.

Also, ValueFlows isn't just theoretical, but is being used in productive capacities in various companies. It's a wonderful place to start if building economic software.

## Holochain

While talking to the authors of ValueFlows, [Bob Haugen and Lynn Foster][3] I came across an interesting project call [holo-rea][4]. Effectively, this is a ValueFlows implementation on top of [Holochain][5].

I had not heard of Holochain before, so I did a deep dive. It looks like a blockchain if a blockchain had infinite sharding and eventual consistency. It's almost built from the perspective of complete distribution and infinite scalability and moving towards data consensus, as opposed to blockchain, which starts with data consensus and tries to move toward scalability.

Essentially, Holochain isn't a cryptocurrency with "smart" contracts, but rather an agent-based networking platform that offers application validation. Each participant has their own personal blockchain (entries are data + header with hash of data and reference to previous header) and when transactions are submitted to the network, they are verified by a set of peers determined by the hash of the transaction before being saved into a distributed hash table (DHT).

Immediately, this brought up a lot of questions for me and how this might work in the context of Basis. Holochain has some pros and cons, which I will try to list exhaustively here.

### Pros

- In theory, scales infinitely. Because there is no data consensus between all participants, only the members of a particular transaction need to hold that data (although the transaction itself is still verified by other members of the network). Scalability is important to us because while cryptocurrencies might get away with only matching Visa's peak tx/s, we're building a system that will hopefully scale to far beyond that, and having artificial limits imposed up-front represents technical dead-ends that will be difficult to reconcile when the time comes.
- Supports private transactions where the body of the transaction does not leave the node, but rather the header is broadcast and stored by the network.
- Has the concept of many different inter-operating networks. A company might have its own private network that deals with internal matters and connects to the greater network which would be more public.
- Handles network partitions more gracefully than blockchains. If a segment of the network is disconnected in a blockchain, participants might keep submitting transactions without knowing they are partitioned from a larger network. Upon reconnecting and joining the larger network again, the smaller network's history will be obliterated. Holochain handles this much more gracefully because it doesn't *need* absolute data consistency. The two networks will merge when the partition is healed without any data loss.
- Truly distributed. Blockchain participants build centralized consensus via distributed mechanisms. Holochain uses distributed validation and storage. There is no centralization of data.
- Holochain apps are built in Rust &lt;3 (Basis is built in rust already).

### Cons

- Represents an entirely new and challenging paradigm when dealing with data. For instance, because all data is agent-centric, [there's no built-in concept of a group in Holochain][6]. In Basis, groups (companies, regions, etc) are essential. Companies have members, and members can perform actions such that it looks like the company itself is acting in its own agency. In effect, given the tools Holochain provides, we have to work backwards toward data consensus on a group level. This is currently a blocker for thinking about using as a platform for Basis. Word has it [group agents are planned][7], although I'm not sure what the scope of this project is yet.
- Extremely new, and therefor somewhat unproven. The ideas behind blockchains haven't really stood the test of time yet, but if blockchains are teenagers, Holochain is a toddler (this is not meant to put it down in any way).
- Documentation lacking. I've found a lot of the documentation to be much less detailed than desired, specifically about how transactions are validated and what data is available to them when this happens. A lot of this knowledge seems to be floating around in the forums. That said, I don't blame the Holochain team because the project is evolving so quickly that accurate and up-to-date documentation would divert a lot of resources that could otherwise go into building a stable platform.

## What's next?

I'm convinced at this point that Basis should be build on top of ValueFlows. I'm also convinced that Holochain will be involved in the project in some capacity, although right now I'm not sure what that will be. Will this mean building Basis on top of Holochain? Does it mean building Basis on top of [holo-rea][4]?

It might be possible to use a blockchain in the places where blockchains are useful and Holochain where scalability is needed. Can the two coexist and interoperate?

I'm meeting with the lead dev of holo-rea soon, and we're hopefully going to do a deep dive on Basis, ValueFlows, and Holochain and figure out how all the pieces fit together.

While the above projects have made the immediate future of Basis a bit more uncertain, they came at a great time (during early formation). The ideas and goals behind Basis are the same as they were before, but now there are more tools to help make that vision come to life.

[1]: https://valueflo.ws/
[2]: https://en.wikipedia.org/wiki/Resources,_events,_agents_(accounting_model)
[3]: http://mikorizal.org/about.html
[4]: https://github.com/holo-rea/holo-rea
[5]: https://holochain.org/
[6]: https://forum.holochain.org/t/how-will-holochain-handle-group-agents/1095
[7]: https://github.com/holochain-open-dev/agent-registration


