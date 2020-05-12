const protocol = 'http';
const host = '118.69.126.39';
const port = ':88';
const prefix = '/tuphap';

const baseURL = `${protocol}://${host}${port}${prefix}`;

export default {
  login({ phone, maDuThi }) {
    return {
      method: 'GET',
      url: baseURL + `/ClientCheckLogin/${phone}/${maDuThi}`
    };
  },

  signUpAndLogin({ phone, maDuThi }) {
    return {
      method: 'GET',
      url: baseURL + `/ClientLoginFirstTimetByPhone/${phone}/${maDuThi}`
    };
  },

  userInfo({ studentId }) {
    return {
      method: 'GET',
      url: baseURL + `/ClientGetStudentInform/${studentId}`
    };
  },

  examInfo({ studentId }) {
    return {
      method: 'GET',
      url: baseURL + `/obj/ClientGetExamInform/${studentId}`
    };
  },

  getQuestions({ studentId, studentTestId }) {
    return {
      method: 'GET',
      url: baseURL + `/ClientQuestion/${studentId}/${studentTestId}`
    };
  },

  getAnswers({ studentId, studentTestId, clientInfo, captcha }) {
    return {
      method: 'POST',
      url: baseURL + `/ClientAnswer/${studentId}/${studentTestId}`,
      data: {
        ClientInfo: clientInfo,
        SessionID: captcha
      }
    };
  },

  updateAnswers({ studentTestId, questionId, answerId }) {
    return {
      method: 'GET',
      url: baseURL + `/ClientUpdate/${studentTestId}/${questionId}/${answerId}`
    };
  },

  updateTimeRemain({ studentTestId, questionId, timeRemaining, answer }) {
    return {
      method: 'GET',
      url: baseURL + `/ClientNextQuestion/${studentTestId}/${questionId}/${timeRemaining}/${answer}`
    };
  },

  finishedTest({ studentTestId }) {
    return {
      method: 'GET',
      url: baseURL + `/ClientFinish/${studentTestId}`
    };
  },

  getPageInfo() {
    return {
      method: 'GET',
      url: baseURL + '/PageInform'
    };
  },

  getExamById({ adminId, tenBang }) {
    return {
      method: 'GET',
      url: baseURL + `/Sys_GetResultByType/${adminId}/${tenBang}`
    };
  },

  getAlert({ studentId, studentTestId }) {
    return {
      method: 'GET',
      url: baseURL + `/ClientAlert/${studentId}/${studentTestId}`
    };
  },

  getAlertLogin() {
    return {
      method: 'GET',
      url: baseURL + '/LoginAlert'
    };
  },

  getExamStatus({ studentId, examId }) {
    return {
      method: 'GET',
      url: baseURL + `/ClientCheckStatus/${studentId}/${examId}`
    };
  },

  getTopScore({ studentId }) {
    return {
      method: 'GET',
      url: baseURL + `/ClientTopScoreInExam/${studentId}`
    };
  },

  getOrganizations({ level, selectedId }) {
    return {
      method: 'GET',
      url: baseURL + `/Client_cboCap0${level}_Select/${selectedId || ''}`
    };
  },

  createOrUpdateUserInfo({ user }) {
    return {
      method: 'POST',
      url: baseURL + '/ClientUpdateInformation',
      data: { ...user }
    };
  },

  changePassword({ password }) {
    return {
      method: 'POST',
      url: baseURL + '/ClientPasswordChange',
      data: { ...password }
    };
  },

  getExamHistories({ studentId }) {
    return {
      method: 'GET',
      url: baseURL + `/ClientGetPageCount/${studentId}`
    };
  },

  getExamHistory({ studentId, page }) {
    return {
      method: 'GET',
      url: baseURL + `/ClientHistorySelect/${studentId}/${page}`
    };
  },

  getScores({ studentId, studentTestId }) {
    return {
      method: 'GET',
      url: baseURL + `/ClientGetMark/${studentId}/${studentTestId}`
    };
  },

  resetPassword({ phone }) { // ClientPasswordReset
    return {
      method: 'POST',
      url: baseURL + '/ClientPasswordReset',
      data: { ...phone }
    };
  },

  getCaptcha({ studentTestId }) {
    return {
      method: 'GET',
      url: baseURL + `/obj/ClientSessionID/${studentTestId}`
    };
  }
};
