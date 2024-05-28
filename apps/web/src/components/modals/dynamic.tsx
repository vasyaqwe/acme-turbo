import { Dialog, DialogContent } from "@acme/ui/dialog"
import { Drawer, DrawerContent } from "@acme/ui/drawer"
import { createResponsiveWrapper } from "pushmodal"

export const { Content, Wrapper } = createResponsiveWrapper({
   desktop: {
      Wrapper: Dialog,
      Content: DialogContent,
   },
   mobile: {
      Wrapper: Drawer,
      Content: DrawerContent,
   },
   breakpoint: 768,
})
