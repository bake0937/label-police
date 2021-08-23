import { Probot } from 'probot';

export = (app: Probot) => {
  /**
   * レビューイが pull request を open すると「WIP」ラベルを貼る．
   */
  app.on('pull_request.opened', async (context) => {
    const labelParams = context.issue({
      labels: ['WIP'],
    });
    await context.octokit.issues.addLabels(labelParams);
  });

  /**
   * レビューイが Conversation で「レビューお願いします」とコメントすると「Needs review」ラベルを貼る．
   */
  app.on('issue_comment.created', async (context) => {
    if (
      context.payload.issue.html_url.includes('pull') &&
      context.payload.comment.body.includes('レビューお願いします') &&
      context.payload.issue.user.login === context.payload.comment.user.login
    ) {
      if (
        context.payload.issue.labels.some((label) => label.name.includes('WIP'))
      ) {
        const removeLabelParams = context.issue({
          name: 'WIP',
        });
        await context.octokit.issues.removeLabel(removeLabelParams);
      }

      const labelParams = context.issue({
        labels: ['Needs review'],
      });
      await context.octokit.issues.addLabels(labelParams);
    }
  });

  /**
   * レビューイが discussion で「レビューお願いします」とコメントすると「Needs review」ラベルを貼る．
   */
  app.on('pull_request_review_comment.created', async (context) => {
    if (
      context.payload.comment.html_url.includes('pull') &&
      context.payload.comment.body.includes('レビューお願いします') &&
      context.payload.comment.user.login === context.payload.comment.user.login
    ) {
      if (
        context.payload.pull_request.labels.some((label) =>
          label.name.includes('WIP')
        )
      ) {
        const removeLabelParams = context.issue({
          name: 'WIP',
        });
        await context.octokit.issues.removeLabel(removeLabelParams);
      }

      const labelParams = context.issue({
        labels: ['Needs review'],
      });
      await context.octokit.issues.addLabels(labelParams);
    }
  });

  /**
   * レビューイが Review で「レビューお願いします」とコメントすると「Needs review」ラベルを貼る．
   */
  app.on('pull_request_review.submitted', async (context) => {
    if (
      context.payload.review.html_url.includes('pull') &&
      context.payload.review.state === 'commented' &&
      context.payload.review.user.login ===
        context.payload.pull_request.user.login
    ) {
      if (
        context.payload.pull_request.labels.some((label) =>
          label.name.includes('WIP')
        )
      ) {
        const removeLabelParams = context.issue({
          name: 'WIP',
        });
        await context.octokit.issues.removeLabel(removeLabelParams);
      }

      const labelParams = context.issue({
        labels: ['Needs review'],
      });
      await context.octokit.issues.addLabels(labelParams);
    }
  });

  /**
   * レビュアーが Request changes を実行した場合は「WIP」ラベルを貼る．
   */
  app.on('pull_request_review.submitted', async (context) => {
    if (context.payload.review.state === 'changes_requested') {
      if (
        context.payload.pull_request.labels.some((label) =>
          label.name.includes('Needs review')
        )
      ) {
        const removeLabelParams = context.issue({
          name: 'Needs review',
        });
        await context.octokit.issues.removeLabel(removeLabelParams);
      }

      const labelParams = context.issue({
        labels: ['WIP'],
      });
      await context.octokit.issues.addLabels(labelParams);
    }
  });

  /**
   * レビューイが pull request を reopen すると「WIP」ラベルを貼る．
   */
  app.on('pull_request.reopened', async (context) => {
    if (
      context.payload.pull_request.labels.some((label) =>
        label.name.includes('Close pull request')
      )
    ) {
      const removeLabelParams = context.issue({
        name: 'Close pull request',
      });
      await context.octokit.issues.removeLabel(removeLabelParams);
    }
    const labelParams = context.issue({
      labels: ['WIP'],
    });
    await context.octokit.issues.addLabels(labelParams);
  });

  /**
   * レビューイが pull request をマージすると全てのラベルを剥がし，「Reviewed」ラベルを貼る，
   * レビューイが pull request を closed すると「Close pull request」ラベルを貼る．
   */
  app.on('pull_request.closed', async (context) => {
    switch (context.payload.pull_request.merged) {
      case true:
        const setLabelParams: any = context.issue({
          labels: ['Reviewed'],
        });
        await context.octokit.issues.setLabels(setLabelParams);
        break;
      default:
        if (
          context.payload.pull_request.labels.some((label) =>
            label.name.includes('Needs review')
          )
        ) {
          const removeLabelParams = context.issue({
            name: 'Needs review',
          });
          await context.octokit.issues.removeLabel(removeLabelParams);
        }

        if (
          context.payload.pull_request.labels.some((label) =>
            label.name.includes('WIP')
          )
        ) {
          const removeLabelParams = context.issue({
            name: 'WIP',
          });
          await context.octokit.issues.removeLabel(removeLabelParams);
        }

        const closeLabelParams = context.issue({
          labels: ['Close pull request'],
        });
        await context.octokit.issues.addLabels(closeLabelParams);
        break;
    }
  });

  // for Debug
  // app.onAny(async (context) => {
  //   app.log.info({ event: context.name, action: context.payload.action, context });
  // });
};
