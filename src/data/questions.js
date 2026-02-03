export const questions = [
    {
        id: 1,
        title: "Explain Event Loop in JavaScript",
        answer: "The Event Loop is a mechanism that allows JavaScript to perform non-blocking operations by offloading operations to the system kernel whenever possible. It constantly checks the call stack and the callback queue. If the call stack is empty, it pushes the first task from the queue to the stack.",
        tags: ["JavaScript", "Frontend"],
    },
    {
        id: 2,
        title: "What is React Virtual DOM?",
        answer: "The Virtual DOM is a lightweight copy of the actual DOM. React uses it to improve performance by calculating the difference (diffing) between the new Virtual DOM and the previous one, and then only updating the changed parts in the real DOM (reconciliation).",
        tags: ["React", "Frontend"],
    },
    {
        id: 3,
        title: "Difference between var, let, and const",
        answer: "var is function-scoped and can be redeclared. let and const are block-scoped and cannot be redeclared in the same scope. const must be initialized during declaration and its value cannot be reassigned (though objects can be mutated).",
        tags: ["JavaScript", "Basics"],
    },
    {
        id: 4,
        title: "What are React Hooks?",
        answer: "Hooks are functions that let you use state and other React features in functional components without writing a class. Examples include useState, useEffect, and useContext.",
        tags: ["React"],
    },
    {
        id: 5,
        title: "Explain CSS Box Model",
        answer: "The CSS box model is essentially a box that wraps around every HTML element. It consists of: Content (the actual image or text), Padding (clear area around content), Border (around padding), and Margin (clear area outside the border).",
        tags: ["CSS", "Frontend"],
    },
    {
        id: 6,
        title: "What is Closure in JavaScript?",
        answer: "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function's scope from an inner function.",
        tags: ["JavaScript", "Advanced"],
    }
];
