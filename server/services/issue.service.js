const sequelize = require('../models');
const { Issue, IssueLabel, IssueAssignee } = require('../models').models;

module.exports = {
  readAll: async (req, res, next) => {
    try {
      const [issuesWithLabel] = await sequelize.query('SELECT * FROM Issue AS I LEFT JOIN `IssueLabel` AS IL ON I.id=IL.IssueId UNION SELECT * FROM Issue AS I RIGHT JOIN `IssueLabel` AS IL ON I.id=IL.IssueId');
      const [issuesAssignee] = await sequelize.query('SELECT * FROM `IssueAssignee`');
      const groups = issuesAssignee.reduce((prev, cur) => {
        const result = prev;
        if (!result[cur.IssueId]) result[cur.IssueId] = [];
        result[cur.IssueId].push(cur.UserId);
        return result;
      }, {});
      const issues = issuesWithLabel.reduce((prev, cur) => {
        const result = prev;
        const { id, LabelId } = cur;
        if (!result[id]) {
          result[id] = groups[id]
            ? { ...cur, assignees: groups[id], labels: [] }
            : { ...cur, labels: [] };
          delete result[id].LabelId;
          delete result[id].IssueId;
        }
        if (LabelId) result[id].labels.push(LabelId);
        return result;
      }, {});
      res.json(Object.values(issues));
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    const willBeUpdated = req.body;
    const IssueId = willBeUpdated.id;
    delete willBeUpdated.id;
    try {
      if (willBeUpdated.label) {
        const { label } = willBeUpdated;
        switch (label.type) {
          case 'add':
            await IssueLabel.create({ IssueId, LabelId: label.id });
            break;
          case 'delete':
            await IssueLabel.destroy({ where: { IssueId, LabelId: label.id } });
            break;
          default:
            throw new Error('type is wrong.');
        }
        delete willBeUpdated.label;
      }
      if (willBeUpdated.assignee) {
        const { assignee } = willBeUpdated;
        switch (assignee.type) {
          case 'add':
            await IssueAssignee.create({ IssueId, UserId: assignee.id });
            break;
          case 'delete':
            await IssueAssignee.destroy({ where: { IssueId, UserId: assignee.id } });
            break;
          default:
            throw new Error('type is wrong.');
        }
        delete willBeUpdated.assignee;
      }
      if (Object.keys(willBeUpdated).length) {
        await Issue.update(willBeUpdated, { where: { id: IssueId } });
      }
      res.json({ message: '수정 되었습니다.' });
    } catch (err) {
      next(err);
    }
  },
};