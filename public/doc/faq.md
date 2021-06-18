# Frequently Asked Questions (FAQ)

## What Is the »Normalized Year« and How Is It Calculated?

We collect three temporal statements for each play, if available:

1. the year(s) of creation (when a play was written),
2. the year of first printing and
3. the year of first performance.

To easily sort plays chronologically, e.g. for a corpus overview or diagrams, we also calculate a »Normalized Year«. This year is usually the earlier date between the date of first printing and the year of first performance.

However, if a work was published or performed much later (more than 10 years) after its creation, the year of its creation is taken as "Normalized Year" (if it is a range of years, the last of them is taken). The reasoning behind this is that in a simple chronological classification, the context of origin is important, for example when trying to describe literary evolution.

An example: Goethe's [»Urfaust«](https://de.wikipedia.org/wiki/Urfaust) was written between 1772 and 1775, but not printed until 1887 and first performed only in 1918. The "Normalized Year" for this play would thus be 1775.

As DraCor is an open-source project, you can have a look at the underlying XQuery algorithm [here](https://github.com/dracor-org/dracor-api/blob/c95af4883f84a43c6ea8324075abd236f0493ffb/modules/util.xqm#L356).
