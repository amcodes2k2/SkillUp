import './App.css';

import Quiz from"./Pages/Quiz.jsx";
import Home from "./Pages/Home.jsx";
import Post from "./Pages/Post.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import Course from "./Pages/Course.jsx";
import Courses from "./Pages/Courses.jsx";
import Lecture from "./Pages/Lecture.jsx";
import Contact from "./Pages/Contact.jsx";
import Earnings from "./Pages/Earnings.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import QuizMaster from "./Pages/QuizMaster.jsx";
import VerifyEmail from "./Pages/VerifyEmail.jsx";
import Discussions from "./Pages/Discussions.jsx";
import Header from "./Components/Shared/Header.jsx";
import Footer from "./Components/Shared/Footer.jsx";
import QuickCompiler from "./Pages/QuickCompiler.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";
import PostForm from "./Components/Forms/PostForm.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import CourseForm from "./Components/Forms/CourseForm.jsx";
import RequireAuth from "./Components/Shared/RequireAuth.jsx";
import RedirectIfLoggedIn from "./Components/Shared/RedirectIfLoggedIn.jsx";
import RequireCourseAccess from "./Components/Shared/RequireCourseAccess.jsx";
import RequireInstructorRole from "./Components/Shared/RequireInstructorRole.jsx";

import { useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { AppContext } from "./Context/AppContext.jsx";

function App() 
{
  const location = useLocation();
  const {isLoading} = useContext(AppContext);

  return (
    (isLoading === false) ?
    <>
      {
        (location.pathname.includes("/quick-compiler") === false) ? <Header></Header> : <></> 
      }
      
      <Routes>
        <Route index element={<Home></Home>}></Route>
        <Route path="/post/:post_id" element={<Post></Post>}></Route>
        <Route path="/contact-us" element={<Contact></Contact>}></Route>
        <Route path="/course/:course_id" element={<Course></Course>}></Route>
        <Route path="/discuss" element={<Discussions></Discussions>}></Route>
        <Route path="/quiz-master" element={<QuizMaster></QuizMaster>}></Route>
        <Route path="/catalog/:category_id" element={<Courses></Courses>}></Route>
        <Route path="/quick-compiler" element={<QuickCompiler></QuickCompiler>}></Route>
        

        <Route element={<RedirectIfLoggedIn></RedirectIfLoggedIn>}>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/reset-password" element={<ResetPassword></ResetPassword>}></Route>
          <Route path="/verify-email/:type" element={<VerifyEmail></VerifyEmail>}></Route>
          <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>
        </Route>

        <Route element={<RequireAuth></RequireAuth>}>
          <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          <Route path="/create-post" element={<PostForm></PostForm>}></Route>
          <Route path="/general-quiz/:quiz_id" element={<Quiz></Quiz>}></Route>

          <Route element={<RequireInstructorRole></RequireInstructorRole>}>
            <Route path="/earnings" element={<Earnings></Earnings>}></Route>
            <Route path="/create-course" element={<CourseForm></CourseForm>}></Route>
          </Route>
        
          <Route element={<RequireCourseAccess></RequireCourseAccess>}>
            <Route path="/sectional-quiz/:quiz_id" element={<Quiz></Quiz>}></Route>
            <Route path="/lecture/:lecture_id" element={<Lecture></Lecture>}></Route>
          </Route>
        </Route>
      </Routes>

      {
        (location.pathname.includes("/quick-compiler") === false) ? <Footer></Footer> : <></> 
      }

      <Toaster position="bottom-center" toastOptions={{
        className: "font-semibold"
      }}>
      </Toaster>
    </>
    :
    <></>
  );
}

export default App;