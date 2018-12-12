export const FETCH_STATS = "FETCH_STATS";

export const fetchStats = stats => {
  return (dispatch, getState, getFirebase) => {
    debugger;
    const firebase = getFirebase();
    firebase.database().ref("/stats").once('value').then(snapshot => {
        dispatch({ type: FETCH_STATS, payload: snapshot.val()})
    });

  };
};
