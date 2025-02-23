import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  option?: String;
  onClick: () => void;

}
export const Buttons = ({ children, option = 'primary', onClick }: Props) => {
  return (

    <button className={"btn btn-" + option} onClick ={onClick} > {children} </button >
  )
}
