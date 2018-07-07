const octokit = require('@octokit/rest')()


/**
 * Automatically tag new versions via webhook
 * 
 * A webtask that can be used as a Github webhook to automatically tag new
 * versions based on changes to the file `package.json`.
 * 
 * Installation instructions:
 * 1. Install the webtask cli: `npm install -g wt-cli`
 * 2. Create a webtask profile: `wt init`
 * 3. Create a Github API token with `repo` access from: https://github.com/settings/tokens/new
 * 4. Generate the webhook url, substituting <YOUR_TOKEN> with the one from step #3: `wt create --name auto_tag --secret GITHUB_TOKEN=<YOUR_TOKEN> --prod https://raw.githubusercontent.com/auth0/wt-cli/master/sample-webtasks/github-tag-hook.js`
 * 5. Install the webhook with the default settings on your repo by subsituting <USERNAME> and <REPO>, at: https://github.com/<USERNAME>/<REPO>/settings/hooks/new
 * 6. Optionally inspect any errors using the cli: `wt logs`
 * 
 * @webtask_option pb 1 - This webtask requires that the body automatically be parsed
 * @webtask_secret GITHUB_TOKEN - A Github access token
 */
module.exports = function (ctx, cb) {
    var err;
    
    if (!ctx.body) {
        err = new Error('This webtask must be created with the `--parse` flag (`pb` claim)');
        return cb(err);
    }

    octokit.authenticate({
        type: 'token',
        token: process.env.wt_ghtoken || ctx.data.GITHUB_TOKEN
    })

    var owner = ctx.body.repository.owner.login;
    var repo = ctx.body.repository.name;
    var issueNumber = ctx.body.issue.number;

    console.log(`Adding labels to the issue ${issueNumber} of the repo ${owner}/${repo}`)
    var labels = ['ack'];

    (async () => {
        try {
            const result = await octokit.issues.addLabels({
                owner: owner,
                repo: repo,
                number: issueNumber,
                labels: labels
            });
        } catch (err) {
            cb(err)
        }
    
        return cb(null, 'OK');
    })(); 
};