import { LucideIcon } from "lucide-react";

interface ToolbarButtonProps{
    Onclick?:()=>void;
    isActive?:boolean;
    icon:LucideIcon;


};

const ToolbarButton = ({

    Onclick,
    isActive,
    icon:Icon,

}:ToolbarButtonProps) => {
    
}
 


export const Toolbar = () =>{
    return (
        <div className="bg-[#f1f4f9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex item-centre gap-x-0.5 overflow-x">
            Toolbar
        </div>
    );
};