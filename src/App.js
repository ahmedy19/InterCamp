import React, { useEffect } from "react";
import "./App.css";
import { Switch, Route, useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import { setCurrentUser } from './redux/user/user.actions';

import ChooseQuizPage from "./pages/choose-quiz";
import HomePage from "./pages/home";
import QuizPage from "./pages/quiz";
import Header from "./components/header/header.component";
import UserPage from './pages/user';
import FavoritePage from './pages/favorite';
import Footer from './components/footer/footer.component'
import { auth, createUserProfileDocument } from "./firebase/firebas.utils";

function App(props) {
  const history = useHistory();
  useEffect(() => {
    const unsubscibeFromAuth = auth.onAuthStateChanged(async userAuth => {
      // check if there is a user
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        // subsrcibe to changes
        userRef.onSnapshot(snapShot => {
          props.setCurrentUser({
            id: snapShot.id,
            ...snapShot.data()
          })
        });
        history.push('/quiz');
      } else {
        props.setCurrentUser(null)
        history.push('/');
      }
    });
    return () => {
      unsubscibeFromAuth();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='App'>
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/quiz" component={ChooseQuizPage} />
        <Route path="/quiz/:quizId" component={QuizPage} />
        <Route path="/user" component={UserPage} />
        <Route path="/favorite" component={FavoritePage} />
      </Switch>
      <Footer />
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(App);
