import React, { useContext } from 'react';

import { PropTypes } from 'prop-types';

import { IssuesContext } from '../../stores/IssueStore';

const styles = {
  item: {
    width: '200px',
    padding: '2px 10px',
    margin: '5px 5px 0 0',
    boxSizing: 'border-box',
    borderRadius: '15px',
  },
  myProgress: {
    height: '10px',
    backgroundColor: '#4CAF50',
  },
  bar: {
    width: '100%',
    backgroundColor: ' #ddd',
  },
};

export default function MilestoneProgressBar({ assignedMilestone }) {
  const { issues } = useContext(IssuesContext);

  if (!issues[0]) return <div />;

  const progressPercentage = (milestoneId) => {
    const issuesWithMilestone = issues.filter((issue) => issue.milestoneId === +milestoneId);
    const closedCount = issuesWithMilestone.filter((e) => e.isClosed === 1).length;

    return (closedCount / issuesWithMilestone.length) * 100;
  };

  return (
    <div css={styles.item}>
      <div css={styles.bar}>
        <div css={{ ...styles.myProgress, width: `${progressPercentage(assignedMilestone.id)}%` }} />
      </div>
      {assignedMilestone.name}
    </div>
  );
}

MilestoneProgressBar.propTypes = {
  assignedMilestone: PropTypes.arrayOf(PropTypes.object).isRequired,
};
