These workflow files belong in `.github/workflows/`. They could not be pushed with the current GitHub token because it lacks the `workflow` scope.

To enable automatic deploys and the Facebook sync, either:

1. In the GitHub web UI, add these two files under `.github/workflows/`, or
2. Re-push them with a personal access token that includes the `workflow` scope.

Until then, the live site is published from the `gh-pages` branch.
