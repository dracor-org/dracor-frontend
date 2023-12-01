# Frequently Asked Questions (FAQ)

## What Is the »Normalized Year« and How Is It Calculated?

We collect three temporal statements for each play, if available:

1. the year(s) of creation (when a play was written),
2. the year of first printing and
3. the year of first performance.

To easily sort plays chronologically, e.g. for a corpus overview or diagrams, we also calculate a »Normalized Year«. This year is usually the earlier date between the date of first printing and the year of first performance.

However, if a work was published or performed much later (more than 10 years) after its creation, the year of its creation is taken as »Normalized Year« (if it is a range of years, the last of them is taken). The reasoning behind this is that in a simple chronological classification, the context of origin is important, for example when trying to describe literary evolution.

An example: Goethe's [»Urfaust«](https://dracor.org/id/ger000539) was written between 1772 and 1775, but not printed until 1887 and first performed only in 1918. The »Normalized Year« for this play would thus be 1775.

As DraCor is an open-source project, you can have a look at the underlying XQuery algorithm [here](https://github.com/dracor-org/dracor-api/blob/88c5d2951d15fa6c6e1d8790d9b514a5e8df65bb/modules/util.xqm#L383).

Please note that you don't necessarily have to work with our »Normalized Year«, but that this is just an offer for quick and reliable chronological overviews and charts. All other temporal information on the creation, publication and first performance of a play is still available both in the TEI documents and via our API.

## What Happens to API Queries Without Version Prefixes?

On December 1, 2023, we published the first stable version of the DraCor API (1.0.0). With this release, we introduced a version prefix into our endpoint URLs (e.g., `https://dracor.org/api/v1/info`). This allows us to run the stable DraCor API side-by-side with the pre-release version that is now available under the `/v0` prefix (e.g., `https://dracor.org/api/v0/info`).

Requests using the old-style URLs without a version prefix are redirected to the legacy version. For instance, `https://dracor.org/api/info` now redirects to `https://dracor.org/api/v0/info`. Therefore, if you haven't adjusted your scripts, they should continue to work as long as they follow the redirect.

If this is not the case, you can simply add the `/v0` to your API URLs. For example, if you have used the API base URL `https://dracor.org/api`, change it to `https://dracor.org/api/v0`.

Of course, we would appreciate it if you switched to `https://dracor.org/api/v1` sooner rather than later. This would, however, most likely require further changes to your scripts. See the [release notes](https://github.com/dracor-org/dracor-api/releases/tag/v1.0.0) to find out what changed in detail and where you may need to make adjustments.

We plan to keep the API version 0.x available for at least a year (i.e., until the end of 2024). After this period, we may phase it out so as not to have to maintain multiple versions of the API indefinitely.

Please also see our blogpost, [»Streamlining the DraCor API«](https://weltliteratur.net/streamlining-the-dracor-api/).
