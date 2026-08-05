
import {type FieldErrors, type UseFormRegister } from "react-hook-form";
import {
  type RegisterUserFormData,
} from "@/features/users/schemas/user.schemas";
import {
  type Role,
} from "@/features/users/services/users.service";
import { FloatingInput, FloatingPassword } from "@/components/ui/FloatingInputs";
import { FloatingSelect } from "@/components/ui/FloatingSelect";
import { IconByName } from "@/components/ui/icons";
import { labelRole } from "@/features/users/utils/permissionLabels";

type UserInputsProps = {
    register: UseFormRegister<RegisterUserFormData>;
    errors: FieldErrors<RegisterUserFormData>;
    roles: Role[];
    selectedRoles: string[];
    onSelectedRolesChange: (roles: string[]) => void;
    loadingRoles: boolean;
  };
  
  export default function UserInputs({
    register,
    errors,
    roles,
    selectedRoles,
    onSelectedRolesChange,
    loadingRoles,
  }: UserInputsProps) {
    return (
      <>
        <FloatingInput
          label="Nombre de usuario"
          type="text"
          autoComplete="name"
          required
          {...register("name")}
          error={errors.name?.message}
          icon={<IconByName name="user" className="h-5 w-5" />}
        />
  
        <FloatingInput
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          required
          inputMode="email"
          {...register("email")}
          error={errors.email?.message}
          icon={<IconByName name="atSign" className="h-5 w-5" />}
        />
  
        <FloatingPassword
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          required
          {...register("password")}
          error={errors.password?.message}
          icon={<IconByName name="lock" className="h-5 w-5" />}
        />
  
        <FloatingPassword
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          required
          {...register("password_confirmation")}
          error={errors.password_confirmation?.message}
          icon={<IconByName name="lock" className="h-5 w-5" />}
        />
  
        <FloatingSelect
          label="Rol"
          value={selectedRoles[0] ?? "user"}
          onChange={(e) =>
            onSelectedRolesChange(e.target.value ? [e.target.value] : [])
          }
          disabled={loadingRoles}
          icon={<IconByName name="users" className="h-5 w-5" />}
          helperText='Se asigna "Usuario" por defecto.'
        >
          {roles.map((role) => (
            <option key={role.id} value={role.name}>
              {labelRole(role.name)}
            </option>
          ))}
        </FloatingSelect>

      </>
    );
  }
  