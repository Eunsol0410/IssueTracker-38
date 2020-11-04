import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import NewIssueTitle from './NewIssueTitle';
import NewIssueComment from './NewIssueComment';
import NewIssueButton from './NewIssueButton';
import NewIssueSideBar from './NewIssueSideBar';

const styles = {
  layout: {
    marginTop: '20px',
    marginLeft: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    width: '800px',
    border: '1px solid #e1e4e8',
    borderRadius: '6px 6px 0 0',
  },
  form: {
    width: '100%',
    flexWrap: 'wrap',
  },
};

const useInput = (initialValue) => {
  const [input, setInput] = useState(initialValue);

  const onChange = (e) => {
    setInput(e.target.value);
  };

  return [input, onChange];
};

export default function NewIssueMain() {
  const history = useHistory();

  const [inputTitle, handleInputTitle] = useInput('');
  const [inputContent, handleInputContent] = useInput('');

  const [assignedUsers, setAssignedUsers] = useState([]);
  const [assignedLabels, setAssignedLabels] = useState([]);
  const [assignedMilestone, setAssignedMilestone] = useState([]);

  const submitNewIssue = () => {
    console.log('inputTitle', inputTitle);
    console.log('inputContent', inputContent);
    console.log('assignedUsers', assignedUsers);
    console.log('assignedLabels', assignedLabels);
    console.log('assignedMilestone', assignedMilestone);
    // TODO: 데이터들을 모아서 API 요청을 여기서 하면 됨
    // 필요한 데이터: userId(이슈 생성자), title, content, assignees(id), labels(id), millstoneId(id)
  };

  const cancelNewIssue = () => {
    // TODO: Cancel버튼을 누르면 이슈 목록 화면으로 전환됨
    // 이때 기존의 폼들을 초기화
  };

  return (
    <div css={styles.layout}>
      <div css={styles.form}>
        <NewIssueTitle
          value={inputTitle}
          onChange={handleInputTitle}
        />
        <NewIssueComment
          value={inputContent}
          onChange={handleInputContent}
        />
        <NewIssueButton
          inputContent={inputContent}
          onSubmit={submitNewIssue}
          onCancel={cancelNewIssue}
        />
      </div>
      <div>
        <NewIssueSideBar
          assignedUsers={assignedUsers}
          setAssignedUsers={setAssignedUsers}
          assignedLabels={assignedLabels}
          setAssignedLabels={setAssignedLabels}
          assignedMilestone={assignedMilestone}
          setAssignedMilestone={setAssignedMilestone}
        />
      </div>
    </div>
  );
}
