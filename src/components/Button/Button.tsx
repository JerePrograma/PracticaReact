import "./Button.css";

interface Props {
  label: string;
  //recibimos una función
  parentMethod: () => void;

  //mandar un evento al padre
}

//componente tonto, stateless
export const Button = ({ label, parentMethod }: Props) => {
  return (
    <button className="custom-button" onClick={parentMethod}>
      {label}
    </button>
  );
};
