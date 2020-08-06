import { readQuery, mutateQuery, escapeData } from 'src/utils/API/queryAPI';
import {
  actionGetUserScores,
  actionUpdateUserScore,
  actionGetPageSkillScores,
  actionGetAllSkills,
  actionSigninUser,
} from 'src/actions/actions';

export const updateUserPoints = (user, points, reason) => dispatch => {
  var d = { username: user.data.username, points: parseInt(points), reason: reason };
  mutateQuery(`point_log(data:"${escapeData(d)}")`).then();
}

export const updateUserScore = (skill_id, score) => dispatch => {
  var d = { score: score };
  mutateQuery(`viewer { skill(to_id:"${skill_id}" data:"${escapeData(d)}") }`).then();
  dispatch(actionUpdateUserScore(skill_id, score));
}

export const requestAllSkills = () => dispatch => {
  return readQuery(`skill`).then(res => {
    var skills = [];
    for (var id in res.data.objects) {
      if (res.data.objects[id].type === 'skill') {
        skills.push(res.data.objects[id]);
      }
    }
    skills.sort((a, b) => (a.data.name || '').localeCompare(b.data.name || ''));
    dispatch(actionGetAllSkills(skills));
    return skills;
  });
}

export const requestUserScores = (id) => dispatch => {
  return readQuery(`profile(id:"${id}") { skill(noobject:1) }`).then(res => {
    var scores = {};
    res.data.edges.forEach(edge => {
      if (edge.type === 'profile/skill') {
        var data = JSON.parse(edge.data);
        scores[edge.to_id] = data.score;
      }
    });
    dispatch(actionGetUserScores(scores));
    return scores;
  });
}

export const requestPageSkillScores = () => dispatch => {
  return readQuery(`skill { page(noobject:1) }`).then(res => {
    var scores = {};
    res.data.edges.forEach(edge => {
      if (edge.type === 'skill/page') {
        var data = JSON.parse(edge.data);
        if (!(edge.to_id in scores)) {
          scores[edge.to_id] = {};
        }
        scores[edge.to_id][edge.from_id] = data.score;
      }
    });
    dispatch(actionGetPageSkillScores(scores));
    return scores;
  });
}
