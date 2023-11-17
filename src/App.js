import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import "./App.css";

// useful librarys for react-hook-form:
// yup - https://www.youtube.com/watch?v=kV5wfVyN6xI&list=PLC3y8-rFHvwjmgBr1327BA5bVXoQH-w5s&index=30&ab_channel=Codevolution
// zod https://www.youtube.com/watch?v=RdnJ5UP3HhY&list=PLC3y8-rFHvwjmgBr1327BA5bVXoQH-w5s&index=30&ab_channel=Codevolution

function App() {
  let renderCount = 0;

  const form = useForm({
    mode: "onTouched", // shows an error if the user clicked on the input field and then clicked on something else without making an input that. if the user returns and starts any input (even one that does not satisfy the form) - the error disappears
  });

  // register automaticly start tracking form state
  const { register, control, handleSubmit, formState, reset, trigger } = form;
  const { errors, isDirty, isValid, isSubmitSuccessful } = formState;

  // tracking is Submit form was Successful. can be used, for example, to prevent multiple submissions after the first submission.
  //now NOT working fully due to check in disabled on submit button
  console.log("isSubmitSuccessful: ", isSubmitSuccessful);

  const onSubmit = (data) => {
    console.log("Form submited", data);
  };

  // with error output, we can improve interaction with the user (for example, by outputting errors not to the console, but as a message to the site. now NOT working due to check in disabled on submit button)
  const onError = (errors) => {
    console.log("Form errors: ", errors);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  renderCount++;
  return (
    <>
      <h2>Hello Serge's React Hook Form!</h2>
      {/* render count do not change during typing */}
      <h3>Render count: {renderCount}</h3>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="form-control">
          <label htmlFor="username">User name</label>
          <input
            type="text"
            id="username"
            {...register("username", {
              required: { value: true, message: "User name is required" },
            })}
          />

          <p className="error">{errors.username?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            {...register("email", {
              required: { value: true, message: "Email is required" },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
              validate: {
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== "admin@example.com" ||
                    "Enter different email adress"
                  );
                },
                notBlackListed: (fieldValue) => {
                  return (
                    !fieldValue.endsWith("baddomain.com") ||
                    "This domain is not supported"
                  );
                },

                // checking whether we already have this email in our database
                emailAvailable: async (fieldValue) => {
                  const responce = await fetch(
                    `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                  );
                  const data = await responce.json();
                  return data.length === 0 || "Email already exist";
                },
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register("channel", {
              required: { value: true, message: "Channel is required" },
            })}
          />
          <p className="error">{errors.channel?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            // set value as number
            type="number"
            id="age"
            {...register("age", {
              // set value as number
              valueAsNumber: true,
              required: { value: true, message: "Age is required" },
            })}
          />
          <p className="error">{errors.age?.message}</p>
        </div>
        {/* the button is not active if one of the conditions is performed. we can add only one of the conditions or vice versa many */}
        <button disabled={!isDirty}>Submit</button>
        {/* checking for both conditions at a time */}
        {/* <button disabled={!isDirty || !isValid}>Submit</button> */}
        {/* reset form to default values, can be used for cleaning fields automatically after successful form submission */}
        <button type="button" onClick={() => reset()}>
          Reset Form
        </button>
        {/* Manually Trigger all form validations */}
        <button type="button" onClick={() => trigger()}>
          Validate Form
        </button>
        {/* Also can be used for triggering individual field like this(example of triggering only 'username'): */}
        <button type="button" onClick={() => trigger("username")}>
          Validate Only User Name
        </button>
      </form>
      <DevTool control={control} />
    </>
  );
}

export default App;
