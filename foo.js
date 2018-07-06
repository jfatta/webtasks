const octokit = require('@octokit/rest')()


module.exports = function(context, cb) {
    
    // token (https://github.com/settings/tokens)
    octokit.authenticate({
        type: 'token',
        token: context.secrets.ghtoken
    });

    console.log(context.body.payload.repository);
    //var owner = context.body.payload.repository.owner.login;
    //var repo = context.body.payload.repository.name;
    //var issueNumer = context.body.payload.issue.number;

    //console.log(`Adding labels to the issue ${issueNumber} of the repo ${owner}/${repo}`)
    //var labels = ['ack'];
    
    (async () => {
        //const result = await octokit.issues.addLabels({owner, repo, issueNumer, labels });
    
        cb(null, `Label added to the issue`);
    })(); 
}